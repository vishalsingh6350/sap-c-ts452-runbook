# TASK 4 — PROCURE TO PAY PROCESS

> **Time box: 25 min** · **Steps: 7** · **Risk: LOW** · **No customizing needed**
> **Do this task FIRST after the plant copy is running.** It is the fastest scoring task in the exam.

**Scenario:** one standard P2P cycle on existing master data — PR → source → PO → output →
goods receipt → parked invoice → posted invoice.

**Everything here uses plant `1010` and purchasing org `101C`. Not Y0##. Not P0##.**

---

## PRE-FLIGHT

```
[ ] Cheat sheet filled: T-R1## , T-ENG## , Z## , C##-GR1 , C##-INV1
[ ] Decimal notation confirmed (730,29 must land as seven hundred thirty euros 29)
[ ] Logged in as TS450-##
```

**Order dependency:** strictly 1 → 2 → 3 → 4 → 5 → 6 → 7. Nothing here can be reordered.

---

## STEP 1 — Purchase requisition for `T-R1##`

**App:** *Create Purchase Requisition* — or **`ME51N`**

### 🚨 FIRST: deselect Source Determination

The exam repeats this Note **three times** on one page. That is not an accident — it is the
thing candidates get wrong. Untick it **before** entering the first item.

### Items — one requisition, two items

| | Item 10 | Item 20 |
|---|---|---|
| Material | `T-R1##` | `T-R1##` |
| Quantity | **`100`** PC (for stock) | **`10`** PC (consumption) |
| Plant | `1010` | `1010` |
| Storage location | `101A` *(or leave blank)* | — |
| Purchasing group | `Z##` | `Z##` |
| Acct assignment cat. | *(blank = stock)* | **`K`** |
| Cost center | — | **`T-ENG##`** |
| G/L account | — | accept the proposal |
| Delivery date | today + 20 days | today + 20 days |

**Save.** → **Log the PR number.**

> ⚠️ "100 pieces for stock and 10 pieces for consumption in cost center T-ENG##" = two items on
> **one** requisition. The wording in step 2 ("Show the created purchase requisitions") is plural
> but refers to the items; keep it as one document.
> ⚠️ If source determination was on, the items come back with a supplier already filled. Delete
> the requisition and redo it — step 2 needs to be a real action.

**✅ Done when:** PR saved, 2 items, **no** source of supply assigned.

---

## STEP 2 — Assign the source of supply

**`ME52N`** → item → tab **Source of Supply** → **Assign Source of Supply**
*(alternative: `ME57`)*

- Pick the **existing** source for **purchasing org `101C`, plant `1010`**
- This will resolve to supplier **`T-SUP01`** (confirmed by step 6, which names that supplier)
- **Assign it on both items**
- **Save**

> ⚠️ If more than one source is offered, filter on purchasing org **101C**. Picking a source from
> a different purchasing org makes the PO in step 3 impossible to create as specified.
> ⚠️ Re-open the PR after saving and confirm both items show the supplier.

**✅ Done when:** both items show source T-SUP01 / 101C.

---

## STEP 3 — Convert the requisition into a purchase order (`NB`)

**`ME21N`** — or app *Create Purchase Order*

### Set the document type FIRST

| Field | Value |
|---|---|
| Document type | **`NB`** (standard PO) |
| Supplier | `T-SUP01` |
| Purchasing Org | **`101C`** |
| Purchasing Group | `Z##` |
| Company Code | `1010` |

### Adopt the items

- **Document Overview On** → selection variant **Purchase Requisitions** → your PR number
- Execute → expand → **drag both items** into the PO

### Check before saving

```
[ ] Both items (100 PC and 10 PC)
[ ] Plant 1010 on both
[ ] Item 20 keeps K / T-ENG##
[ ] Purchasing group Z##
[ ] Net price populated from the info record
```

**Save.** → **Log the PO number.** You need it in steps 4, 5, 6.

> ⚠️ Document type cannot be changed after the first item. Set `NB` first.
> ⚠️ Adopt from the PR — do not retype. The PR→PO link is checked.

**✅ Done when:** PO type NB exists, references your PR, purch org 101C, plant 1010.

---

## STEP 4 — Process the output

**`ME23N`** → **Messages / Output** tab
- Message record present → select → **Further data** → *Send immediately* → save
- Then **`ME9F`**: Purchasing group **`Z##`**, your PO number → **Execute**

*If no record exists:* create output type **`NEU`**, medium **`1`** (print) or **`5`**, partner
function **`VN`**, then issue via `ME9F`.

**Verify:** `ME23N` → Messages → **Successfully processed** (green).

> ⚠️ The exam explicitly says *"Use your purchasing group Z##"* here — that is the selection
> criterion in ME9F and it confirms the PO carries Z##. If ME9F finds nothing with Z##, your PO
> has the wrong purchasing group. Fix the PO, then re-issue.

**✅ Done when:** output status is green.

---

## STEP 5 — Post the goods receipt

**`MIGO`** — or app *Post Goods Receipt for Purchasing Document*

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Purchase Order** |
| PO number | your Task 4 PO |
| Movement type | `101` (automatic) |

### The header text — do not miss this

**Header area → tab `General` → field `Document Header Text`:**

```
C##-GR1
```

### Items

- Both items proposed (100 PC and 10 PC)
- Material **`T-R1##`**, plant **`1010`**
- Storage location for the stock item: `101A` (or whatever the PO proposes)
- Tick **Item OK** on both lines
- **Check** → **Post**

→ **Log the material document number.**

> ⚠️ `Document Header Text` is on the **header** *General* tab, not on the item. It is easy to
> fill *Delivery Note* or *Bill of Lading* by mistake — those are different fields and score nothing.
> ⚠️ The exam warns *"Be aware that your PO's document type is NB"* — if you search for the PO
> and find nothing, you are probably filtering on the wrong document type.
> ⚠️ Post a **full** goods receipt (100 + 10). A partial GR breaks the invoice arithmetic in step 6.

**✅ Done when:** material document posted for both items with header text `C##-GR1`.

---

## STEP 6 — PARK the invoice (do not post it)

**`MIR7`** — *Park Incoming Invoice*
*(Do NOT use MIRO here. MIRO posts.)*

### Basic data tab

| Field | Value |
|---|---|
| Invoice date | today |
| Posting date | today |
| **Reference** | **`C##-INV1`** |
| Amount | **`730,29`** |
| Currency | `EUR` |
| **Calculate tax** | ☑ ticked |
| Tax code | the one from the PO (accept the proposal) |

### PO reference

- Category: **Purchase Order / Scheduling Agreement**
- Enter your **Task 4 PO number** → **Enter**
- The two items populate (100 PC and 10 PC of `T-R1##`)

### Expected result

The **Balance** field will show a difference of about **66,00** in red.
**That is correct and intended** — it is the unclarified transportation cost.

### Park it

Press **Save** (in `MIR7` the Save button **parks** the document).
→ **Log the parked invoice number.**

> 🚨 **SILENT KILLER #6.** If you post here instead of parking, step 7 has nothing to do and both
> steps score wrong. `MIR7` + Save = parked. Do not click *Post*.
> ⚠️ **`730,29` = seven hundred thirty euros and twenty-nine cents.** If your decimal notation is
> the US one, type `730.29`.
> ⚠️ Leave the 66 balance alone at this stage. Do not force it to zero yet.

**✅ Done when:** invoice exists with status **Parked**, reference `C##-INV1`, balance ≈ 66.

---

## STEP 7 — Change the parked invoice and POST it

**`MIR4`** — *Display Invoice Document* → enter your parked invoice number → switch to **change**
mode (the pencil / *Edit* button)
*(alternative: `MIR6` invoice overview → filter status "Parked" → open yours)*

### Add the transportation cost

Go to the **Details** tab (next to Basic Data) → field **`Unplanned Delivery Costs`**.

The exam says the 66 is **including tax**, and unplanned delivery costs are entered **net**:

| If the PO tax rate is | Enter |
|---|---|
| 10 % | **`60,00`** (66 ÷ 1.10) |
| 19 % | **`55,46`** (66 ÷ 1.19) |

**Method that always works — do not guess the tax rate:**
1. Type a first guess (`60,00`)
2. Press **Enter** and read the **Balance** field
3. Adjust the unplanned delivery cost by exactly the remaining balance
4. Repeat until **Balance = 0,00**

> ⚑ **JUDGMENT CALL — why net, not 66.** The exam gives `730,29` as the *total including tax* and
> `66,00` as transportation *including tax*. If you type 66 into a net field with *Calculate tax*
> on, the system adds tax on top of 66 and the balance overshoots. Entering the net value is what
> makes the balance reach exactly zero — and a zero balance is the proof the number was right.

### Post

**Balance must be `0,00`** → **Post**.
→ **Log the posted invoice number.**

> ⚠️ "post the transportation costs to the purchase order" = leave the standard configuration,
> which **distributes unplanned delivery costs across the invoice items** and therefore onto the
> PO / material value. Do not look for a separate freight G/L line.
> ⚠️ Do **not** create a new invoice here. You must change **the parked one** and post it.
> The document number should stay the same as the parked one.

**✅ Done when:** the invoice document number from step 6 now has status **Posted**, balance 0.

---

## TASK 4 FINAL CHECK

```
[ ] 1  PR: 1 document, 2 items (100 stock + 10 to T-ENG##), plant 1010, Z##, no source at creation
[ ] 2  Source T-SUP01 / 101C assigned to BOTH items
[ ] 3  PO type NB, purch org 101C, plant 1010, created FROM the PR
[ ] 4  ME23N Messages -> Successfully processed
[ ] 5  GR posted, both items, header text C##-GR1
[ ] 6  Invoice was PARKED with reference C##-INV1 and amount 730,29
[ ] 7  SAME invoice changed (unplanned delivery costs) and POSTED, balance 0,00
```

**Numbers to log:** PR #, PO #, GR material document #, invoice # (parked = posted, same number).

---

### Quick troubleshooting

| Problem | Fix |
|---|---|
| Balance will not reach 0 | Your amount or the unplanned cost is wrong. Re-check `730,29` and re-derive the net freight from the actual balance shown. |
| "Document contains no items" on invoice | Wrong PO number, or the goods receipt (step 5) was not posted — with GR-based IV, no GR means no invoice line. |
| GR-based IV blocks the invoice | Post step 5 first. Steps are in order for a reason. |
| ME9F finds nothing | Purchasing group on the PO is not Z##, or output record was never generated. |
| Cannot change the parked invoice | You are in MIR4 display mode — click the pencil / *Document → Change*. |
