# TASK 5 — SUBCONTRACTING PROCESS

> **Time box: 30 min** · **Steps: 7** · **Risk: MEDIUM-HIGH** · **One customizing step (needs transport)**

**Scenario:** a product is made by a subcontractor. One component is shipped to the
subcontractor **directly by another supplier**. Then invoice tolerance is configured so small
over-invoicing is reduced automatically.

**Everything uses plant `1010`, purchasing org `101C`, document type `NB`.**

### The three parties — keep them straight

| Who | Number | Role |
|---|---|---|
| **Subcontractor** | `T-S50A##` | makes `T-FL4A##` for you |
| **Component supplier** | `T-S52A##` | ships `T-FL4A1##` **directly to the subcontractor** |
| Your plant | `1010` / SLoc `101A` | supplies the other components |

> Mixing up T-S50A## and T-S52A## is the most common mistake in this task. **T-S5*0*A = the one
> who builds. T-S5*2*A = the one who ships the part.**

---

## ⚠️ READ BEFORE YOU START: DO STEP 6 BEFORE STEP 7

Step 6 creates the tolerance group that automatically reduces small invoice over-charges.
Step 7 posts an invoice that relies on that reduction. **Automatic invoice reduction only applies
at posting time.** If you post first and configure after, the reduction never happens and both
steps are wrong. The exam numbers them 6 then 7 — follow that order literally.

**Safe execution order: 1 → 2 → 3 → 4 → 5 → 6 → 7.**

---

## STEP 1 — Purchase order to the subcontractor (item category `L`)

**`ME21N`**

| Field | Value |
|---|---|
| Document type | **`NB`** |
| Supplier | **`T-S50A##`** |
| Purchasing Org | `101C` |
| Purchasing Group | `Z##` |
| Company Code | `1010` |

### Item 10

| Field | Value |
|---|---|
| **Item category** | **`L`** (subcontracting) |
| Material | `T-FL4A##` |
| Quantity | `100` PC |
| Net price | `1500,00` |
| Plant | `1010` |
| Storage location | `101A` |
| Delivery date | today + 20 days |

> 🚨 **Item category `L` is the whole task.** Enter it **before** you press Enter on the item
> line. With `L`, SAP explodes the bill of material and opens a **component screen** listing the
> parts the subcontractor needs. Without `L` you have an ordinary PO and every later step fails.

### Check the component overview

After pressing Enter on the item, SAP shows the **components**. Note them down:

```
Components required for 100 PC of T-FL4A## :
  ____________________  qty ______   <- one of these should be T-FL4A1##
  ____________________  qty ______
  ____________________  qty ______
```

**Which components come from where:**
- **`T-FL4A1##`** → comes from the **direct delivery** (step 2 + step 4). Do **not** issue it
  from your own stock.
- **All other components** → issued from plant 1010 / SLoc 101A in step 3.

**Save.** → **Log the PO number.**

**✅ Done when:** PO type NB, supplier T-S50A##, item category L, components visible.

---

## STEP 2 — Component PO with direct delivery to the subcontractor

**`ME21N`** — a **second, separate** purchase order.

| Field | Value |
|---|---|
| Document type | **`NB`** |
| Supplier | **`T-S52A##`** |
| Purchasing Org | `101C` |
| Purchasing Group | `Z##` |

### Item 10

| Field | Value |
|---|---|
| Item category | *(blank = standard)* |
| Material | **`T-FL4A1##`** |
| Quantity | **`200`** PC |
| Net price | `500,00` |
| Plant | `1010` |
| Delivery date | today + 10 days |

### 🚨 THE CRITICAL FIELD — SC Vendor

**Item detail → tab `Delivery Address`:**

| Field | Value |
|---|---|
| **SC Vendor** (Subcontractor) | **`T-S50A##`** |

Ticking/filling this tells SAP the goods go straight to the subcontractor and the goods receipt
posts into **stock provided to vendor (special stock O)**, not into your plant.

> 🚨 **SILENT KILLER #8 of the exam.** Without this field, the goods receipt in step 4 lands in
> plant 1010 unrestricted stock. Everything still saves. Nothing errors. The entire
> subcontracting scenario is scored wrong.
> - In some releases the field is labelled **SC Vendor** with a checkbox next to the address block.
> - The address on the tab should switch to the subcontractor after you fill it. **Look for that
>   change — it is your confirmation.**

**Save.** → **Log the PO number.**

**✅ Done when:** PO saved AND re-opening it shows `Delivery Address → SC Vendor = T-S50A##`.

---

## STEP 3 — Goods issue of the components you provide

### 3a. Check what is actually available

**`ME2O`** — *Monitor Stocks of Material Provided to Vendor*
- Supplier: `T-S50A##`, Plant: `1010`
- It lists every component, its requirement, and the stock already at the subcontractor

### 3b. Top up if stock is short (movement `501`)

If any component you must provide has insufficient stock in 1010 / 101A:

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Other** |
| Movement type | **`501`** |
| Material | the short component |
| Quantity | **`500`** PC *(the exam states 500 pc each)* |
| Plant / SLoc | `1010` / `101A` |

**Post.** Repeat per short component. → Log the document number.

> ⚠️ The exam says *"in the quantity of 500 pc each"* — 500 per component, not 500 total.
> ⚠️ A 501 on a material with price control V and price 0 can error. If it does, set a price on
> the material first (MM02 → Accounting 1).

### 3c. Post the goods issue (movement `541`)

**Easiest route — from `ME2O`:** select the component lines → **Post Goods Issue**
**Alternative:** `MIGO` → Goods Issue → Purchase Order → your step-1 PO → movement `541`
**Alternative:** `MB1B` → movement `541`, special stock `O`, vendor `T-S50A##`

**Issue only the components you supply — NOT `T-FL4A1##`.**

> ⚑ **JUDGMENT CALL.** The exam says "perform a goods issue for the subcontracting components…
> available in plant 1010 and storage location 101A", and then treats `T-FL4A1##` separately in
> step 4 via the direct delivery. **Recommendation: exclude `T-FL4A1##` from the 541.** Issuing it
> from your own stock as well would double-supply the subcontractor and contradict the whole
> reason the direct-delivery PO exists.
> *Exception:* if `ME2O` shows `T-FL4A1##` as the **only** component in the BOM, issue it too —
> but check first.

→ **Log the 541 material document number.**

**✅ Done when:** ME2O shows the provided components sitting in stock at T-S50A##.

---

## STEP 4 — Goods receipt for the directly delivered component

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Purchase Order** |
| PO number | your **step 2** PO (`T-S52A##`) |
| Quantity | `200` PC |

Tick **Item OK** → **Check** → **Post**.

### 🚨 VERIFY IMMEDIATELY — this is your SC-Vendor proof

Before moving on, check the item's **Where** tab during entry, or run **`MMBE`** for `T-FL4A1##`
afterwards:

```
[ ] Stock type shows "Stock Provided to Vendor" / special stock O at T-S50A##
[ ] NOT unrestricted stock in plant 1010
```

If it landed in plant 1010 unrestricted stock, the SC Vendor field in step 2 was not set.
**Reverse the GR (MIGO → Cancel), fix the PO, re-post.** Do this now — it is 3 minutes here
and an unrecoverable fail later.

→ **Log the material document number.**

**✅ Done when:** 200 PC of T-FL4A1## are in stock provided to vendor at T-S50A##.

---

## STEP 5 — Goods receipt of the finished product + extra consumption

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Purchase Order** |
| PO number | your **step 1** PO (`T-S50A##`, item category L) |
| Quantity | `100` PC |
| Plant / **Storage location** | `1010` / **`101A`** |

### The extra 2 pieces of `T-FL4A1##`

Before posting, open the item's **component / subcontracting** detail:
- In `MIGO`, select the item → the lower detail area has a **component list** (sometimes reached
  via the item line expand arrow or the *Subcontracting* / *Material* tab)
- Find **`T-FL4A1##`** and **increase its quantity by 2** over the proposed consumption

**Post.**

> ⚠️ *"Post an additional consumption of 2 pieces from product T-FL4A1## as the supplier consumed
> two more of this component"* — this is an **over-consumption of the component**, recorded on the
> same goods receipt. The component consumption posts as movement **543**.
> ⚠️ **If you already posted without the extra 2:** do not cancel. Use
> **`MIGO` → Subsequent Adjustment → Purchase Order** (your step 1 PO) and enter `+2` for
> `T-FL4A1##`. That is the correct correction path and it also scores.

→ **Log the material document number.**

**✅ Done when:** 100 PC of `T-FL4A##` are in 1010/101A and component consumption of `T-FL4A1##`
is 2 higher than the BOM proposal.

---

## STEP 6 — Supplier-specific tolerance group `C##` — **BEFORE step 7**

### 6a. Create the tolerance group

**SPRO → Materials Management → Logistics Invoice Verification → Incoming Invoice →
*Configure Vendor-Specific Tolerances***

**New Entries:**

| Field | Value |
|---|---|
| Company Code | `1010` |
| Tolerance Group | **`C##`** |
| Currency | `EUR` |
| Description | `CERT tolerance ##` |

Then set the **automatic invoice reduction** limit:

| Setting | Value |
|---|---|
| Automatic invoice reduction — **upper limit / value** | **`50,00`** EUR |
| (check-limit indicator for that line) | ☑ active |

**Save** to transport request `C_TS452_##`.

> ⚠️ The requirement is *"invoices with deviations of up to EUR 50 should always be reduced
> automatically"*. That is the **automatic invoice reduction** limit — not "automatic acceptance"
> (which would just accept the difference) and not the ordinary tolerance keys in `OMR6`.
> If the screen offers *Negative small differences*, *Positive small differences*, *Automatic
> acceptance* and *Automatic invoice reduction* — the last one is yours, set to 50.

### 6b. Assign it to supplier `T-S52A##`

**`BP`** → `T-S52A##` → role **FI Vendor** → **Company Code `1010`** →
tab **Vendor: Account Management** *(or* **Payment Transactions** *— it sits on one of the two)*

| Field | Value |
|---|---|
| **Tolerance Group** | **`C##`** |

**Save.**

> 🚨 Creating the group without assigning it does nothing. The assignment is what makes step 7 work.
> ⚠️ Assign it to **`T-S52A##`** (the component supplier who sends the invoice in step 7),
> **not** to T-S50A##.

**✅ Done when:** `BP T-S52A##` → company code 1010 shows tolerance group `C##`.

---

## STEP 7 — Post the invoice for the direct delivery

**`MIRO`** — *Enter Incoming Invoice* (this one is **posted**, not parked)

| Field | Value |
|---|---|
| Invoice date / Posting date | today |
| **Reference** | **`C##-INV2`** |
| Amount | **`110030,00`** ← one hundred ten thousand and thirty |
| Currency | `EUR` |
| Calculate tax | ☑ ticked |
| PO reference | your **step 2** PO (`T-S52A##`) |

Press **Enter** — the 200 PC line populates.

### What you should see

The PO is 200 × 500 = **100.000,00** net. With tax the expected total is very close to
**110.030,00** — the small difference is deliberate and sits **within your EUR 50 tolerance**.

**Expected behaviour:** the system **automatically reduces** the invoice and creates a
**complaint / invoice-reduction** document alongside it. A message about invoice reduction is
**good news** — it proves step 6 worked.

**Post.** → **Log the invoice number.**

> 🚨 **`110.030,--` = `110030,00`.** Not 110,03. This single field has ended more exam attempts
> than any other in the task.
> ⚠️ If the balance is large (thousands, not tens), you have the wrong PO — you are probably on
> the step-1 subcontracting PO. Use the **step 2** PO from `T-S52A##`.
> ⚠️ If a balance of ~30 EUR refuses to clear and no reduction happens, step 6 is not active.
> Go back, check the group exists **and** is assigned, then redo the invoice.
> ⚠️ Post only **one** invoice. If you must retry, remember the newest document is the one graded.

**✅ Done when:** invoice posted with reference `C##-INV2`, with automatic reduction applied.

---

## TASK 5 FINAL CHECK

```
[ ] 1  PO NB / T-S50A## / item cat L / 100 PC T-FL4A## / 1500,00 / plant 1010
[ ] 2  PO NB / T-S52A## / 200 PC T-FL4A1## / 500,00 / SC VENDOR = T-S50A##   <- re-verify
[ ] 3  501 posted if needed (500 pc each) ; 541 goods issue posted for provided components
[ ] 4  GR for step-2 PO landed in STOCK PROVIDED TO VENDOR (MMBE check)
[ ] 5  GR for step-1 PO into 101A, component T-FL4A1## consumption +2
[ ] 6  Tolerance group C## in CC 1010, auto invoice reduction 50 EUR, ASSIGNED to T-S52A##
[ ] 7  Invoice posted, reference C##-INV2, amount 110030,00, reduction applied
```

**Numbers to log:** both PO #s, 501 doc, 541 doc, both GR docs, invoice #.

---

### Quick troubleshooting

| Problem | Fix |
|---|---|
| No component screen on the step-1 PO | Item category is not `L`. Delete the item and re-enter with `L` first. |
| "Deficit of stock" on the 541 | Post the 501 top-up (500 pc) first, then retry. |
| GR went to plant stock instead of vendor stock | SC Vendor missing on the step-2 PO. Cancel GR, fix PO, re-post. |
| Cannot find the component detail in MIGO | Expand the item line; the component list sits under the item, not the header. |
| Invoice balance ~30 and no reduction | Tolerance group not created, not set to 50, or not assigned to T-S52A##. |
| Tolerance group screen not in SPRO path | Search SPRO for "vendor-specific tolerances" using the SPRO search function. |
