# CHEAT SHEET — fill this in ONCE, then copy from here all exam

> **My group number `##` = ________**
> Fill the right-hand column by hand in the first 5 minutes. After that you never
> re-derive a key under time pressure — you read it off this page.

---

## 1. My keys (write the resolved value)

| Placeholder | Pattern | **MY VALUE** | Used in |
|---|---|---|---|
| Plant | `Y0##` (Y‑ZERO‑##) | Y0____ | T3 |
| Purchasing org | `P0##` (P‑ZERO‑##) | P0____ | T3 |
| Purchasing group | `Z##` | Z____ | ALL tasks |
| User | `TS450-##` | TS450-____ | login, T3 workflow approver |
| Transport request | `C_TS452_##` | C_TS452_____ | T3, T5 config |
| Product (battery) | `T-RC##` | T-RC____ | T3 |
| Supplier (new) | `SP-C##` | SP-C____ | T3 |
| Supplier search term | `CTS452-##` | CTS452-____ | T3 |
| Supplier house no. | `C##` | C____ | T3 |
| Storage bin (T3) | `GR##` | GR____ | T3 |
| Workflow name | `CERT##` | CERT____ | T3 |
| Cost center | `T-ENG##` | T-ENG____ | T3, T4, T6, T7 |
| Material (P2P) | `T-R1##` | T-R1____ | T4 |
| GR header text | `C##-GR1` | C____-GR1 | T4 |
| Invoice ref 1 | `C##-INV1` | C____-INV1 | T4 |
| Subcon product | `T-FL4A##` | T-FL4A____ | T5 |
| Subcon component | `T-FL4A1##` | T-FL4A1____ | T5 |
| Subcontractor | `T-S50A##` | T-S50A____ | T5 |
| Component supplier | `T-S52A##` | T-S52A____ | T5, T7 |
| Tolerance group | `C##` | C____ | T5 |
| Invoice ref 2 | `C##-INV2` | C____-INV2 | T5 |
| Contract supplier | `S520-3##` | S520-3____ | T6 |
| Warning-sign material | `B520-5##` | B520-5____ | T6 |
| Material group (signs) | `WS##` | WS____ | T6 |
| Material group (electr.) | `ET##` | ET____ | T6 |
| Transfer header text | `C##-TR` | C____-TR | T6 |
| MRP material | `T-RC5##` | T-RC5____ | T7 |
| MRP material descr. | `Certification GR##` | Certification GR____ | T7 |
| MRP storage bin | `C-GR##` | C-GR____ | T7 |
| MRP controller | `0##` | 0____ | T7 |
| MRP supplier | `S520-1##` | S520-1____ | T7 |

---

## 2. Fixed values that never change

| Thing | Value |
|---|---|
| Password | `Welcome1` |
| Fiori entry | `S4HANA T41 Launchpad` |
| Company code | `1010` |
| Existing plant (T4–T7) | `1010` |
| Existing purch. org (T4–T7) | `101C` |
| Storage locations | `101A`, `101C` |
| Country | `DE` (Germany) |
| City / postal code | `Nussloch` / `69226` |
| Region (Baden-Württemberg) | `08` |
| Currency | `EUR` |
| Reconciliation account | `21100000` |
| Payment terms | `0001` |
| Incoterms | `FH` |
| Valuation class | `3000` |
| Product type | `ROH` |
| Product group | `00103` |
| Division | `00` |
| BP grouping | `BPAB` |
| Purchasing value key | `1` |

---

## 3. Document types / item categories / movement types at a glance

| Where | What | Value |
|---|---|---|
| T3 step 9 | PO document type | **ZNBF** |
| T4, T5, T6 | PO document type | **NB** |
| T6 step 1 | Contract type | **WK** (value contract) |
| T7 step 7 | Contract type | **MK** (quantity contract) |
| T5 step 1 | PO item category | **L** (subcontracting) |
| T6 item 10 | Contract item category | **M** (material unknown) |
| T6 item 20 | Contract item category | **W** (material group) |
| T4/T5/T7 | Acct assignment for cost center | **K** |
| T5 step 3 | Goods issue to subcontractor | **541** |
| T5 step 3 | Stock top-up without PO | **501** |
| T5 step 5 | Extra component consumption | **543** (or adjust in GR) |
| T6 step 3 | GR into blocked stock | **103** |
| T6 step 3 | Release GR blocked stock | **105** |
| T6 step 4 | Quality insp. → unrestricted | **321** |
| T7 step 3 | GR without PO | **501** |
| T7 step 4/8 | Reservation (cost center) | **201** |

---

## 4. Amounts — written the German way, and what to actually type

> Check SU3 → Defaults → Decimal Notation first. If your setting is `1,234,567.89`,
> type the **US column**. If it is `1.234.567,89`, type the **German column**.

| Task | Exam says | German input | US input |
|---|---|---|---|
| T3.5 | 500,-- | `500,00` | `500.00` |
| T3.5 | 450,-- | `450,00` | `450.00` |
| T3.5 | 520,-- | `520,00` | `520.00` |
| T3.5 | 470,-- | `470,00` | `470.00` |
| T3.8 | 5000,-- | `5000,00` | `5000.00` |
| T4.6 | 730,29 | `730,29` | `730.29` |
| T4.6 | 66,-- | `66,00` | `66.00` |
| T5.1 | 1500,-- | `1500,00` | `1500.00` |
| T5.2 | 500,-- | `500,00` | `500.00` |
| T5.6 | EUR 50 | `50,00` | `50.00` |
| T5.7 | 110.030,-- | `110030,00` | `110030.00` |
| T6.1 | 100.000,-- | `100000,00` | `100000.00` |
| T6.1 | 5,-- | `5,00` | `5.00` |
| T6.2 | 99,90 | `99,90` | `99.90` |
| T7.2 | 10,-- | `10,00` | `10.00` |
| T7.7 | 9,50 | `9,50` | `9.50` |

**Burn this in: `110.030,--` is one hundred ten thousand and thirty euros, not 110 euros 3 cents.**

---

## 5. Dates I need to compute (fill in on exam day)

| Needed for | Rule | **MY DATE** |
|---|---|---|
| T3.5 info record valid-to (this year) | 31.12 of current year | ____________ |
| T3.5 next-year prices valid-from | 01.01 of next year | ____________ |
| T3.6 PR delivery date | today + ~20 days (must exceed 10-day lead time) | ____________ |
| T6.1 contract valid from | 1st of the **current** month | ____________ |
| T6.1 contract valid to | valid-from + 1 year − 1 day | ____________ |
| T7.4 reservation 1 date | today + 2 days | ____________ |
| T7.7 quantity contract from | 1st of the **current** month | ____________ |
| T7.7 quantity contract to | valid-from + 1 year − 1 day | ____________ |
| T7.8 reservation 2 date | any day in the first week of **next** month | ____________ |

---

## 6. Which plant / purchasing org, per task — check before every document

| Task | Plant | Purch. org | Purch. group |
|---|---|---|---|
| Task 3 | **Y0##** | **P0##** | Z## |
| Task 4 | 1010 | 101C | Z## |
| Task 5 | 1010 | 101C | Z## |
| Task 6 | 1010 | 101C | Z## |
| Task 7 | 1010 | 101C | Z## |

*Task 3 is the only task that uses your own plant and purchasing org. Everything else uses
1010 / 101C. If you catch yourself typing Y0## outside Task 3, stop.*
