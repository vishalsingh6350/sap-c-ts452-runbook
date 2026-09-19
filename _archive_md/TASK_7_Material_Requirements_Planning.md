# TASK 7 — MATERIAL REQUIREMENTS PLANNING

> **Time box: 35 min** · **Steps: 10** · **Risk: MEDIUM** · **No customizing**
> Most steps are short. The danger is sequence: **every step feeds the MRP run that follows it.**

**Scenario:** a new raw material planned by reorder point, sourced automatically by MRP — first
from a purchasing info record, then from a quantity contract.

**Everything uses plant `1010`, storage location `101A`, purchasing org `101C`.**

---

## THE SHAPE OF THIS TASK — know where you are going

```
  Steps 1-2 : master data so MRP can plan AND find a source
  Steps 3-4 : create a stock situation and a requirement
  Step  5   : MRP RUN #1  -> purchase requisition assigned to S520-1##
  Step  6   : change that PR and FIX it so run #2 cannot destroy it
  Steps 7-9 : quantity contract + source list so MRP prefers the contract
  Step 10   : MRP RUN #2  -> a SECOND requisition, assigned to the contract
```

**Do not reorder.** Running MRP before the reservation exists produces nothing to plan.

---

## STEP 1 — Create material `T-RC5##`

**`MM01`** — or app *Manage Product Master Data*

### Initial screen

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Industry sector | `M` or the default |
| Material type | **`ROH`** |

### Views to select

```
[x] Basic Data 1
[x] Purchasing
[x] MRP 1
[x] MRP 2
[x] MRP 3
[x] MRP 4               (select it; harmless if empty)
[x] General Plant Data / Storage 1
[x] Accounting 1
```

The exam says: *"Maintain the views for purchasing, storage, and accounting as well"* — on top of
the MRP views.

### Organizational levels

| Field | Value |
|---|---|
| Plant | **`1010`** |
| Storage location | **`101A`** |

### Field values

**Basic Data 1**

| Field | Value |
|---|---|
| Description | **`Certification GR##`** |
| Base Unit of Measure | `PC` |
| Material group | any valid (e.g. `00103`) |

**Purchasing**

| Field | Value |
|---|---|
| **Purchasing Group** | **`Z##`** |
| Order unit | `PC` |

**MRP 1**

| Field | Value |
|---|---|
| **MRP Type** (the exam calls it *MRP Procedure*) | **`V1`** |
| **MRP Controller** | **`0##`** |
| **Reorder Point** | **`80`** |
| **Lot Size** | **`FX`** (fixed order quantity) |
| **Fixed Lot Size** | **`200`** |

**MRP 2**

| Field | Value |
|---|---|
| Procurement type | `F` (external procurement) |
| **Planned Delivery Time** | **`10`** |
| **Safety Stock** | **`20`** |

**MRP 3**

| Field | Value |
|---|---|
| **Availability Check** | **`Y2`** |

**General Plant Data / Storage 1**

| Field | Value |
|---|---|
| **Storage Bin** | **`C-GR##`** |

**Accounting 1**

| Field | Value |
|---|---|
| **Valuation Class** | **`3000`** |
| **Price Control** | **`V`** |
| Moving Average Price | **`10,00`** *(recommended — see note)* |
| Price Unit | `1` |

**Save.**

> ⚠️ **`V1`** is *manual reorder point planning including external requirements* — that is what
> makes the reservations in steps 4 and 8 drive the MRP result. Do not use `VB`.
> ⚠️ Storage bin is **`C-GR##`** here — different from Task 3, which used `GR##`. Easy to confuse.
> ⚠️ Setting the moving average price to `10,00` is not demanded but strongly recommended: the
> 501 goods receipt in step 3 needs a price, and the PR valuation price in step 6 should be 10.
> ⚠️ MRP views must be created **for plant 1010**. A material without MRP views at plant level is
> simply skipped by the MRP run — with no error.

**✅ Done when:** `MM03` shows MRP 1/2/3 for plant 1010 with all eight MRP values above.

---

## STEP 2 — Purchasing info record + make it MRP-relevant

### 2a. Info record

**`ME11`**

| Field | Value |
|---|---|
| Vendor | **`S520-1##`** |
| Material | `T-RC5##` |
| Purchasing Org | **`101C`** |
| Plant | `1010` |
| Info category | Standard ☑ |

Purchasing Organization Data 1:

| Field | Value |
|---|---|
| Purchasing Group | `Z##` |
| Planned Delivery Time | `10` |
| **Standard Quantity** | **`100`** |
| **Net Price** | **`10,00`** EUR per `1` `PC` |

**Save.** → **Log the info record number.**

### 2b. Make it relevant for MRP — the source list

**`ME01`** — *Maintain Source List* (or app *Manage Source Lists*)

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Plant | `1010` |

New line:

| Valid from | Valid to | Vendor | Purch. Org | **MRP** | Fix |
|---|---|---|---|---|---|
| today | 31.12.9999 | `S520-1##` | `101C` | **`1`** | *(leave blank for now)* |

**Save.**

> ⚑ **JUDGMENT CALL — "mark the information record as relevant for MRP".** The purchasing info
> record itself has no MRP flag in S/4HANA. The mechanism that makes MRP pick a source is the
> **source list**, whose **MRP indicator `1`** means *"record relevant to MRP"*.
> **Recommendation: create the info record AND the source list line with MRP = 1.** That covers
> both readings and is the only way step 5 can produce an assigned requisition.
> *Optional extra:* tick **Source list** on MRP 2 of the material master to make the source list
> binding. Not required — skip if time is tight.

**✅ Done when:** `ME03` shows one source list line for S520-1## with MRP indicator 1.

---

## STEP 3 — Post a goods receipt of 50 PC

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Other** |
| **Movement type** | **`501`** |
| Material | `T-RC5##` |
| Quantity | **`50`** PC |
| Plant / SLoc | `1010` / **`101A`** |

**Post.** → **Log the material document number.**

> ⚠️ No purchase order is given, so this is a receipt without reference — movement **501**.
> ⚠️ If it errors on valuation, the material has no price. `MM02` → Accounting 1 → set 10,00.

**✅ Done when:** `MMBE` shows 50 PC unrestricted in 1010 / 101A.

---

## STEP 4 — Reservation for 10 PC, today + 2 days

**`MB21`** — *Create Reservation* (or app *Manage Reservations*)

| Field | Value |
|---|---|
| Base date | **today + 2 days** |
| **Movement type** | **`201`** (goods issue to cost center) |
| Plant | `1010` |
| **Cost Center** | **`T-ENG##`** |

Item:

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Quantity | **`10`** PC |
| Storage location | `101A` |

**Save.** → **Log the reservation number.**

> ⚠️ Movement type `201` is what makes it a cost-center consumption reservation.
> ⚠️ The date matters — it is a requirement date MRP will see. Today + 2, not today.

**✅ Done when:** the reservation appears in `MD04` for `T-RC5##`.

---

## STEP 5 — MRP RUN #1

**`MD02`** — *MRP — Single-item, Multi-level*
*(`MD03` single-level also works for a purchased raw material)*

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Plant | `1010` |
| **Processing key** | **`NEUPL`** (regenerative planning) |
| **Create purchase req.** | **`1`** (purchase requisitions immediately) |
| Delivery schedules | `3` |
| **Create MRP list** | **`1`** |
| Planning mode | `1` |
| Scheduling | `1` |

Press Enter twice past the warning, then **Execute**.

### Check the result — `MD04`

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Plant | `1010` |

**What you should see:** stock 50, safety stock 20, reorder point 80, reservation 10 → shortage →
**one purchase requisition for 200 PC** (the fixed lot size), **assigned to supplier `S520-1##`**.

→ **Log the PR number** (double-click the requisition line in MD04 to read it).

> 🚨 **The requisition must show supplier S520-1##.** If it has no supplier, your source list
> (step 2b) is missing or its MRP indicator is not `1`. Fix the source list and re-run MD02.
> ⚠️ **`Create purchase req. = 1`.** If you leave `2`, you get **planned orders** instead of
> requisitions and the step scores nothing.
> ⚠️ Use `NEUPL`, not `NETCH` — you want a full regeneration.

**✅ Done when:** MD04 shows one purchase requisition, 200 PC, supplier S520-1##.

---

## STEP 6 — Change the requisition and FIX it

**`ME52N`** → your requisition number

| Change | Where | Value |
|---|---|---|
| **Valuation price** | item detail → tab **`Valuation`** | **`10,00`** EUR |
| **Delivery date** | item overview or *Quantities/Dates* | proposed date **+ 1 day** |
| **Fixed** | item detail → tab **`Quantities/Dates`** (checkbox *Fixed* / *Requisition fixed*) | **☑ TICK IT** |

**Save.**

> 🚨 **SILENT KILLER #9.** If you do not tick **Fixed**, MRP run #2 in step 10 recalculates and
> **overwrites or deletes** this requisition — your date change and price vanish, and step 10 may
> show only one requisition instead of two. The exam says *"The purchase requisition should be
> fixed after the change"* — that is a checkbox, not a figure of speech.
> ⚠️ Change the delivery date to the **proposed date + 1 day**, not today + 1.
> ⚠️ If the *Fixed* checkbox is not on *Quantities/Dates*, look for a **Fixed** column in the item
> overview, or a *Fixed* toggle in the Fiori *Manage Purchase Requisitions* app.

**✅ Done when:** re-opening the PR shows price 10,00, the shifted date, and the Fixed flag set.

---

## STEP 7 — Quantity contract with `T-S52A##`

**`ME31K`**

| Field | Value |
|---|---|
| Vendor | **`T-S52A##`** |
| **Agreement Type** | **`MK`** (quantity contract) |
| Agreement date | today |
| Purchasing Org | `101C` |
| Purchasing Group | `Z##` |
| Plant | `1010` |

Header:

| Field | Value |
|---|---|
| **Valid from** | 1st day of the **current** month |
| **Valid to** | valid-from **+ 1 year − 1 day** |

Item 10:

| Field | Value |
|---|---|
| Material | **`T-RC5##`** |
| **Target quantity** | **`5000`** PC |
| **Net price** | **`9,50`** EUR per `1` `PC` |
| Plant | `1010` |

**Save.** → **Log the contract number AND the item number (10).** You need both in step 9.

> ⚠️ `MK` = **quantity** contract (target quantity). Task 6 used `WK` — value contract. Different.
> ⚠️ The supplier is `T-S52A##`, the same component supplier from Task 5. Not S520-1##.

**✅ Done when:** `ME33K` shows type MK, 5000 PC, 9,50, valid one year from the 1st of this month.

---

## STEP 8 — Second reservation, 250 PC, first week of next month

**`MB21`**

| Field | Value |
|---|---|
| Base date | **any day in the first week of NEXT month** (e.g. 03.10.2026) |
| Movement type | **`201`** |
| Plant | `1010` |
| Cost Center | **`T-ENG##`** |

Item:

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Quantity | **`250`** PC |
| Storage location | `101A` |

**Save.** → **Log the reservation number.**

> ⚠️ This is the requirement that triggers the *second* requisition. Without it, step 10 produces
> nothing new and looks like the MRP run failed.
> ⚠️ Must be **next month**, first week. A date this month would merge into the existing coverage.

**✅ Done when:** `MD04` shows a second reservation for 250 PC next month.

---

## STEP 9 — Make the contract the source for MRP

**`ME01`** → material `T-RC5##`, plant `1010`

Add a second line, and adjust the first:

| Valid from | Valid to | Vendor | Purch. Org | **Agreement** | **Item** | **MRP** | **Fix** |
|---|---|---|---|---|---|---|---|
| today | 31.12.9999 | `T-S52A##` | `101C` | your **MK contract no.** | `10` | **`1`** | **☑** |
| *(existing line)* | | `S520-1##` | `101C` | | | **blank** | ☐ |

**Save.**

> ⚑ **JUDGMENT CALL — how to make MRP choose the contract.** With two MRP-relevant source list
> lines, MRP may pick either. **Recommendation: put the contract line at MRP = `1` and tick
> `Fix` (fixed source of supply), and blank the MRP indicator on the info-record line.**
> Reasoning: `Fix` forces MRP to that source, which is exactly what step 10 demands ("assigned to
> the supplier T-S52A## and the contract you created"). The first requisition is already **fixed**
> from step 6, so removing MRP relevance from the old line cannot damage it.
> ⚠️ You must enter **both** the agreement number **and** the agreement item (`10`). A contract
> number without an item is not a usable source.

**✅ Done when:** `ME03` shows two lines; the contract line has the agreement, item 10, MRP 1, Fix ticked.

---

## STEP 10 — MRP RUN #2

**`MD02`** — same settings as step 5:

| Field | Value |
|---|---|
| Material | `T-RC5##` |
| Plant | `1010` |
| Processing key | **`NEUPL`** |
| Create purchase req. | **`1`** |
| Delivery schedules | `3` |
| Create MRP list | `1` |
| Planning mode | `1` |

**Execute**, then check **`MD04`**.

### What you should see

```
[ ] The FIRST requisition is still there, still fixed, supplier S520-1##
[ ] A SECOND, NEW requisition exists
[ ] The second one shows supplier T-S52A## AND the contract number + item 10
```

Double-click the new requisition → **Source of Supply** tab → it should name the outline
agreement, not just a vendor.

→ **Log the second PR number.**

> ⚠️ If the first requisition disappeared: it was not fixed. Go back to step 6, fix it, re-run.
> ⚠️ If the second requisition has a supplier but no contract: the source list line is missing the
> agreement **item** number, or `Fix` is not ticked.
> ⚠️ If nothing new appears: the step-8 reservation is missing or dated in the wrong month.

**✅ Done when:** MD04 shows two requisitions — one fixed on S520-1##, one on the contract.

---

## TASK 7 FINAL CHECK

```
[ ] 1  T-RC5## : plant 1010, SLoc 101A, bin C-GR##, Z##, val class 3000, price ctrl V
[ ] 1  MRP: type V1, controller 0##, ROP 80, lot size FX, fixed lot 200,
          planned deliv 10, safety stock 20, avail. check Y2
[ ] 2  Info record S520-1## / 101C / price 10,00 / std qty 100
[ ] 2  Source list line for S520-1## with MRP indicator 1
[ ] 3  501 goods receipt, 50 PC, 1010 / 101A
[ ] 4  Reservation 10 PC, cost center T-ENG##, date = today + 2
[ ] 5  MRP run 1 -> PR for 200 PC assigned to S520-1##
[ ] 6  PR changed: valuation price 10,00, date +1 day, FIXED ticked
[ ] 7  Quantity contract MK, T-S52A##, 5000 PC, 9,50, one year from 1st of month
[ ] 8  Reservation 250 PC, T-ENG##, first week of next month
[ ] 9  Source list: contract line with agreement + item 10, MRP 1, Fix ticked
[ ] 10 MRP run 2 -> second PR assigned to T-S52A## AND the contract; first PR intact
```

**Numbers to log:** info record #, 501 doc, reservation 1 #, PR 1 #, contract #, reservation 2 #, PR 2 #.

---

### Quick troubleshooting

| Problem | Fix |
|---|---|
| MRP run produces nothing | Material has no MRP views for plant 1010, or processing key is NETCH with no changes. Use NEUPL. |
| Planned orders instead of requisitions | *Create purchase req.* was `2`. Set it to `1` and re-run. |
| Requisition has no supplier | Source list missing, MRP indicator not `1`, or the source list line is not valid on the requisition date. |
| First requisition vanished after run 2 | It was not fixed. Redo step 6, then step 10. |
| Second requisition uses the info record, not the contract | Blank the MRP indicator on the info-record source list line and tick `Fix` on the contract line. |
| Cannot enter the contract in ME01 | You must give both the agreement number and the agreement **item** (10). |
| 501 goods receipt fails on valuation | Set a moving average price on the material (MM02 → Accounting 1 → 10,00). |
