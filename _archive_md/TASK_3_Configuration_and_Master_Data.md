# TASK 3 — CONFIGURATION AND MASTER DATA

> **Time box: 55 min** (split it: steps 1–2 early at 0:10, steps 3–10 at 0:50)
> **Steps: 10** · **Risk: HIGHEST in the exam** · **Needs SPRO + transport request**

**Scenario:** Lexontive GmbH builds the procurement process from scratch — own plant, own
purchasing org, own product, own supplier, own info record, own approval workflow, then one
full PR → PO → release → output cycle.

**This is the only task that uses `Y0##` and `P0##`. Everything else in the exam uses 1010 / 101C.**

---

## PRE-FLIGHT FOR THIS TASK

```
[ ] Group number confirmed, cheat sheet filled
[ ] Y0## and P0## use a ZERO after the letter  (Y-zero-##, P-zero-##)
[ ] Transport request C_TS452_## created (or reuse the existing one)
[ ] SAP GUI / SPRO reachable
[ ] Logged in as TS450-## via S4HANA T41 Launchpad
```

**Order dependency inside this task:**
`1 → 2 → 3 → 4 → 5 → 6 → 7 → 9 → 10`, with **8 (workflow) mandatory before 9**, otherwise
the PO is created without approval and step 10 has nothing to release.

---

## STEP 1 — Create plant `Y0##` as a COPY

**Goal:** new plant, copied (not newly created), with 101A + 101C, addressed in Nussloch.

### 1a. Decide the template

**SPRO → Enterprise Structure → Definition → Logistics – General → Define, copy, delete, check plant → Define Plant**

- Look for **`CT00`**. If it exists → that is your template.
- If it does not exist → use **`1010`**.

> The exam is explicit: prefer CT00 so that 1010 is not endangered. Check first, do not assume.

### 1b. Do the copy

**SPRO → Enterprise Structure → Definition → Logistics – General → Define, copy, delete, check plant → *Copy, delete, check plant*** (double-click)

Then menu: **Organizational object → Copy org. object** (F6)

| Field | Value |
|---|---|
| From plant | `CT00` (or `1010`) |
| To plant | `Y0##` |

- When asked **"copy all dependent entries?" → YES.** This is the whole point of the step.
- Accept the transport request `C_TS452_##` when prompted.
- The copy runs for a while. **Let it finish.** Read the completion log.

> 🚨 **SILENT KILLER #1 of this exam.** If you instead go to *Define Plant → New Entries* and
> type the plant in by hand, you get a plant with **zero dependent assignments** — no company
> code link, no valuation area, no purchasing data. It looks perfect on screen and scores nothing.
> **You must use Copy org. object.**

### 1c. Maintain name and address

**Define Plant → select `Y0##` → Details**

| Field | Value |
|---|---|
| Name 1 | `CERT Y0##` |
| (address icon / Detailed information) | |
| Street | `Goethestrasse` *(any street is allowed)* |
| House number | **`Y0##`** |
| Postal code | `69226` |
| City | `Nussloch` |
| Country | `DE` |
| Region | `08` *(Baden-Württemberg — recommended, not stated)* |
| Language | `DE` |

**Save.**

> ⚠️ The house number is **`Y0##`**, not the street name and not a normal number. The exam
> says "You can use any street name, but use house number Y0##" — that is a deliberate,
> checkable field.
> ⚠️ "Name 1" is what the exam calls the *description*: `CERT Y0##`, exactly, one space.

### 1d. Storage locations 101A and 101C

**T-code `OX09`** — or SPRO → Enterprise Structure → Definition → Materials Management → Maintain storage location

- Enter plant `Y0##`
- Check which storage locations came across with the copy
- **New Entries** for whichever of `101A` / `101C` is missing, with any description

> ⚠️ The template plant may have brought its own storage locations with different IDs. Do not
> assume 101A/101C exist just because the copy succeeded — **look**.

### 1e. Verify the company code assignment

**T-code `OX18`** → confirm `Y0##` sits under company code **`1010`**.

If it does not, assign it there. The exam says "use the existing company code (1010)".

**✅ Step 1 done when:** plant Y0## exists, description `CERT Y0##`, address Nussloch/69226 with
house number Y0##, storage locations 101A and 101C present, assigned to company code 1010.

---

## STEP 2 — Create purchasing organization `P0##`

### 2a. Define it

**SPRO → Enterprise Structure → Definition → Materials Management → Maintain purchasing organization → New Entries**

| Field | Value |
|---|---|
| Purchasing Organization | `P0##` |
| Description | `CERT P0##` |

**Save** to the transport request.

### 2b. Assign it to your plant

**T-code `OX17`** — or SPRO → Enterprise Structure → **Assignment** → Materials Management → **Assign purchasing organization to plant**

**New Entries:** `P0##` + `Y0##` → **Save**

### 2c. Company code assignment — **JUDGMENT CALL**

The exam says the purchasing org is **"plant-specific for procurement in your new plant"**.

- **Plant-specific** purchasing org = assigned to a **plant**, *not* to a company code.
- **Company-code-specific** purchasing org = assigned to a company code (`OX01`).

**Recommendation: do the plant assignment (2b) only, and leave `OX01` empty.** That is the
literal meaning of "plant-specific", and procurement for Y0## still works because Y0## belongs
to company code 1010.

*If you later hit an error that purchasing org P0## has no company code, add the OX01
assignment then — it will not break the plant assignment.*

**✅ Step 2 done when:** P0## exists with description `CERT P0##` and is assigned to plant Y0##.

---

## STEP 3 — Product master `T-RC##` (the battery)

**App:** *Manage Product Master Data* — or **`MM01`**

### 3a. Initial screen

| Field | Value |
|---|---|
| Material | `T-RC##` |
| Industry sector | `M` (Mechanical engineering) or the default offered |
| Material type | **`ROH`** (raw material) |

### 3b. Select views — "only what the purchasing process needs"

```
[x] Basic Data 1
[x] Purchasing
[x] General Plant Data / Storage 1
[x] General Plant Data / Storage 2
[x] Accounting 1
```

Skip MRP, Sales, Work Scheduling, Costing. The exam says *"Only create the necessary data for
the purchasing process in the beginning."*

### 3c. Organizational levels

| Field | Value |
|---|---|
| Plant | **`Y0##`** |
| Storage location | **`101C`** |

> ⚠️ If you leave storage location blank, the storage-bin field on Plant Data/Storage 1 will
> not accept your entry and the material is not extended to 101C.

### 3d. Field values

**Basic Data 1**

| Field | Value |
|---|---|
| Description (EN) | `Battery GR##` |
| Base Unit of Measure | `PC` |
| Product Group / Material Group | `00103` |
| Division | `00` |

**German description** — the easy one to miss:
*Basic Data 1 → button* **`Additional Data`** *→ tab* **`Descriptions`** *→ add row:*

| Language | Description |
|---|---|
| `DE` | `Batterie GR##` |
| `EN` | `Battery GR##` |

**Purchasing**

| Field | Value |
|---|---|
| Order Unit | `PC` |
| Purchasing Group | `Z##` |
| Purchasing Value Key | `1` |

**General Plant Data / Storage 1**

| Field | Value |
|---|---|
| Storage Bin | `GR##` |

**Accounting 1**

| Field | Value |
|---|---|
| Valuation Class | `3000` |
| Price Control | **`V`** (moving average) |
| Moving Average Price | `500` *(recommended — see note)* |
| Price Unit | `1` |

**Save.** Note the material number on your log sheet.

> ⚠️ **Price control `V`** is the graded bit — the exam says *"valued by the moving average price."*
> Entering `500` as the moving average price is not demanded but is recommended: it matches the
> info record price, and a material with price 0 can throw errors on goods receipt and on
> unplanned-delivery-cost postings later.
> ⚠️ Do **not** extend this material to plant 1010. It belongs to Y0## only.

**✅ Step 3 done when:** `MM03 T-RC##` shows plant Y0##, SLoc 101C, price control V, valuation
class 3000, bin GR##, purchasing group Z##, value key 1, and BOTH language descriptions.

---

## STEP 4 — Supplier `SP-C##`

**App:** *Maintain Business Partner* — or **`BP`**

### 4a. Create

- **Create → Organization**
- **Grouping: `BPAB`**
- **Business Partner number: `SP-C##`**

> 🚨 **Grouping cannot be changed after you save.** Get it right on the create screen.
> If BPAB uses external numbering you type `SP-C##` yourself; if the field is greyed out,
> you picked the wrong grouping.

### 4b. General data (role: *Business Partner (Gen.)*)

| Field | Value |
|---|---|
| Name | anything sensible, e.g. `CERT Supplier ##` |
| Search Term 1 | **`CTS452-##`** |
| Street | `Goethestrasse` |
| House Number | **`C##`** |
| Postal Code | `69226` |
| City | `Nussloch` |
| Country | `DE` |
| Region | `08` |
| **Language** | **`DE`** ← this is "communication is in German" |

### 4c. Role *FI Vendor* (FLVN00) → **Company Code** button → `1010`

| Tab | Field | Value |
|---|---|---|
| Vendor: Account Management | Reconciliation Account | `21100000` |
| Vendor: Payment Transactions | Terms of Payment | `0001` |

*(Note the **Tolerance Group** field on one of these two tabs — you do not need it here, but
Task 5 step 6 uses exactly this field on a different supplier.)*

### 4d. Role *Supplier* (FLVN01) → **Purchasing Org** button → `P0##`

| Field | Value |
|---|---|
| Order Currency | `EUR` |
| Terms of Payment | `0001` |
| Incoterms | `FH` |
| Incoterms Location | `Nussloch` *(S/4 often makes this mandatory)* |
| Purchasing Group | `Z##` |
| **Planned Delivery Time** | **`15`** |
| **GR-Based Inv. Verif.** | **☑ ticked** |

**Save.**

> 🚨 **SILENT KILLER.** Switching the role in the dropdown is not enough. You must click the
> **Company Code** button and enter 1010, and click the **Purchasing Org** button and enter P0##.
> Without those, the BP exists and the vendor does not — every later document will reject it.
> ⚠️ "Invoice verification should be based on the Goods Receipt" = the **GR-Based IV** checkbox.
> ⚠️ "delivers your materials within 15 days" = **Planned Delivery Time 15** on the purchasing
> org data. Do not confuse it with the info record's 10 days in step 5 — both are intended.

**✅ Step 4 done when:** BP `SP-C##` has all three role segments and you can re-open the
Purchasing Org P0## view and see the GR-based IV tick.

---

## STEP 5 — Purchasing info record (with scales and two validity periods)

**T-code `ME11`** — or app *Manage Purchasing Info Records*

### 5a. Initial screen

| Field | Value |
|---|---|
| Vendor | `SP-C##` |
| Material | `T-RC##` |
| Purchasing Org | **`P0##`** |
| Plant | **`Y0##`** |
| Info category | **Standard** ☑ |

> ⚠️ Enter the **plant**. A purchasing-org-only info record will not be found when your PR/PO
> is for plant Y0##.

### 5b. Purchasing Organization Data 1

| Field | Value |
|---|---|
| Planned Delivery Time | **`10`** |
| Purchasing Group | `Z##` |
| Standard Quantity | **`100`** |
| Net Price | `500` |
| Currency / per / UoM | `EUR` / `1` / `PC` |
| Tax code | accept the default the system proposes |

### 5c. Conditions and scales — **read this twice**

Click **Conditions**. Condition type **PB00** = 500 EUR per 1 PC.
Select the line → **Scales** button:

| Scale quantity | Amount |
|---|---|
| `1` (base) | `500,00` |
| **`11`** | `450,00` |

> ⚑ **JUDGMENT CALL — the scale quantity.** The exam says *"Once you order a quantity higher
> than 10 pc, you pay 450."* "Higher than 10" literally means **11 and above**, so the scale
> line goes at **11**. Some training solutions place it at 10.
> **Recommendation: use 11.** Reason: at quantity 11 both readings give 450, so 11 is safe for
> that check; and at quantity 10 only the "11" version still returns 500, matching *"The price
> for one battery is 500"*. The "11" entry is correct under both checks; "10" is correct under
> only one.

**Validity of this first record:**

| Field | Value |
|---|---|
| Valid from | today |
| Valid to | **`31.12.<current year>`** |

**Save** the info record. Note the number.

### 5d. Add the next-year validity period

**`ME12`** → same key → **Conditions** → menu **Edit → Validity periods** (or the *Validity
Periods* button) → **create a new period**:

| Field | Value |
|---|---|
| Valid from | `01.01.<next year>` |
| Valid to | `31.12.9999` |
| PB00 | `520,00` |
| Scale at `11` | `470,00` |

**Save.**

> ⚠️ If you leave the first record open to 31.12.9999, the second period overlaps and SAP will
> either refuse it or silently truncate. Close the current-year record at 31.12 **first**.
> ⚠️ All four prices belong to purchasing org **P0##** — the exam repeats this twice.

**✅ Step 5 done when:** `ME13` shows two validity periods, each with a base price and a scale.

---

## STEP 6 — Purchase requisition (ONE requisition, TWO items)

**App:** *Create Purchase Requisition* — or **`ME51N`**

### 🚨 BEFORE ENTERING ANYTHING: deselect Source Determination

In `ME51N` this is a checkbox in the header area. In the Fiori app it is a toggle on the
creation screen. **Untick it.** The exam calls this out in a Note — it is graded indirectly,
because step 7 exists only to assign the source manually.

### Items

| | Item 10 | Item 20 |
|---|---|---|
| Material | `T-RC##` | `T-RC##` |
| Quantity | `50` PC | `5` PC |
| Plant | `Y0##` | `Y0##` |
| Storage location | `101C` | — |
| Purchasing group | `Z##` | `Z##` |
| Acct assignment cat. | *(blank = stock)* | **`K`** |
| Cost center | — | **`T-ENG##`** |
| G/L account | — | accept the proposal |
| Delivery date | today + 20 days | today + 20 days |

**Save.** Note the PR number.

> ⚠️ **One PR with two items**, not two requisitions. The exam says *"Create the first purchase
> requisition… they need to order five additional batteries"* — additional items on the same
> document.
> ⚠️ Delivery date must clear the 10-day planned delivery time plus processing, or you get date
> warnings and a back-dated schedule. Today + 20 is comfortable.
> ⚠️ "Order the products for your newly created plant" — both items are plant **Y0##**.

**✅ Step 6 done when:** PR saved, 2 items, no source of supply on either.

---

## STEP 7 — Assign source of supply

**`ME52N`** (open your PR) → item → tab **Source of Supply** → **Assign Source of Supply**
*(alternative: `ME57` — Assign and Process Requisitions)*

- Choose the source for supplier **`SP-C##`**, purchasing org **`P0##`**
- **Do this for BOTH items** (10 and 20)
- **Save**

> ⚠️ If several sources are offered, take the one whose purchasing org is P0##.
> ⚠️ After saving, re-open and confirm the *Fixed Vendor* / source fields are populated on both
> items. An unsaved assignment looks identical on screen.

**✅ Step 7 done when:** both PR items show supplier SP-C## / purch org P0## as source.

---

## STEP 8 — Flexible workflow `CERT##` — **do this BEFORE step 9**

**App:** *Manage Workflows for Purchase Orders*

### 8a. Create

| Field | Value |
|---|---|
| Workflow Name | **`CERT##`** |
| Description | `CERT##` or anything |
| Valid From | today |

### 8b. Start / precondition

| Condition | Operator | Value |
|---|---|---|
| Purchasing Organization | is | `P0##` |
| Purchase Order Net/Overall Value | **greater than** | `5000` `EUR` |
| Created By | is | `TS450-##` |

### 8c. Step

- Step type: **Release of Purchase Order**
- Recipients: **User** → `TS450-##`

### 8d. ACTIVATE

Set the workflow to **Active** and **Save**. Then look at the workflow **list order / priority** —
if a broader catch-all workflow sits above yours, yours may never be evaluated. Move `CERT##`
up if the app allows ordering.

> 🚨 **SILENT KILLER #4.** A saved-but-inactive workflow is indistinguishable from a working one
> until the PO fails to get blocked. After step 9, the PO **must** show *Release required /
> In Approval*. If it does not, your workflow did not match — re-check the three conditions,
> especially *Created By* and the currency on the value condition.
> ⚠️ "higher than 5000" = operator **>**, not ≥.
> ⚠️ Your Task 3 PO is 27,500 EUR (50 × 500 + 5 × 500), comfortably above the limit.

**✅ Step 8 done when:** `CERT##` appears in the workflow list with status **ACTIVE**.

---

## STEP 9 — Convert the PR into a purchase order (`ZNBF`)

**`ME21N`** — or app *Create Purchase Order*

### 9a. Set the document type FIRST

| Field | Value |
|---|---|
| Document type | **`ZNBF`** |
| Supplier | `SP-C##` |
| Purchasing Org | **`P0##`** |
| Purchasing Group | `Z##` |
| Company Code | `1010` |

> 🚨 The document type **cannot be changed after the first item is entered.** Set it, tab out,
> then adopt the items.

### 9b. Adopt from your requisition

- **Document Overview On** → selection variant **Purchase Requisitions** → enter your PR number
- Execute, expand, **drag both items** into the PO (or select and click *Adopt*)

### 9c. Check before saving

```
[ ] Both items present (50 PC stock, 5 PC to cost center T-ENG##)
[ ] Plant on both items = Y0##
[ ] Price = 500,00 pulled from the info record (not 0, not manual)
[ ] Item 20 still carries account assignment K + T-ENG##
[ ] Purchasing group Z##
```

**Save.** Note the PO number.

> ⚠️ Creating a fresh PO and typing the material in by hand loses the PR→PO link that the grader
> checks. Always adopt.
> ⚠️ After saving, the PO should be **blocked for approval** by your workflow. If it saves clean
> and ready, go back to step 8.

**✅ Step 9 done when:** PO of type ZNBF exists, references your PR, and shows a release/approval status.

---

## STEP 10 — Release the PO and process the output

### 10a. Release

**App:** *My Inbox* (approve the workflow item as `TS450-##`)
*Alternative:* *Manage Purchase Orders* → open PO → **Release / Approve**

Confirm the PO status changes to **Released**.

### 10b. Process the output

**`ME23N`** → header (or item) → **Messages / Output** tab
- If a message record exists: select it → **Further Data** → check *Send immediately* → save
- Then **`ME9F`** → select your PO → **Execute** to actually issue it

*If no message record exists:* create one manually — output type **`NEU`**, medium **`1` (Print)**
or **`5` (External send)**, partner function **`VN`** (vendor) — then issue via `ME9F`.

**Verify:** `ME23N` → Messages → status must read **Successfully processed** (green).

> ⚠️ Output cannot be processed while the PO is still blocked. **Release first.**
> ⚠️ A yellow/"not processed" message record scores as not done. Chase it to green.

**✅ Step 10 done when:** PO released AND output status green.

---

## TASK 3 FINAL CHECK

```
[ ] 1  OX18: Y0## -> company code 1010 | OX09: 101A + 101C exist under Y0##
[ ] 1  Plant name = CERT Y0##, house no = Y0##, 69226 Nussloch DE
[ ] 2  P0## description CERT P0##, OX17 shows P0## + Y0##
[ ] 3  MM03 T-RC##: price ctrl V, val class 3000, bin GR##, Z##, value key 1, DE + EN text
[ ] 4  BP SP-C##: General + CC 1010 + PurchOrg P0##; GR-based IV ticked; PDT 15
[ ] 5  ME13: PB00 500 / scale 11 = 450 to 31.12.YYYY ; 520 / scale 11 = 470 from 01.01.YYYY+1
[ ] 6  PR: 1 document, 2 items, plant Y0##, item 20 = K / T-ENG##
[ ] 7  Both PR items show source SP-C## / P0##
[ ] 8  Workflow CERT## = ACTIVE
[ ] 9  PO type ZNBF, from the PR, purch org P0##, plant Y0##
[ ] 10 PO released + output "Successfully processed"
```

**Numbers to log:** info record #, PR #, PO #.
