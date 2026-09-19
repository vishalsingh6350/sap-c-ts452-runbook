# C_TS452 — Practical Assessment Guides

Built from `C_TS452_EN_2601_Task_Instructions.pdf` (SAP Certified Associate – Implementation
Consultant – SAP S/4HANA Cloud Private Edition, Sourcing and Procurement, v2601).

## How to use these during the exam

| Order | File | When |
|---|---|---|
| 1 | **[00_EXAM_DAY_PLAYBOOK.md](00_EXAM_DAY_PLAYBOOK.md)** | Read once the night before, then again in the first 10 minutes. Contains the pre-flight, the time budget, the silent killers, the log sheet and the final verification sweep. |
| 2 | **[01_CHEATSHEET_my_values.md](01_CHEATSHEET_my_values.md)** | Fill in ALL blanks in the first 5 minutes. Keep it open permanently — every key, amount, date rule and plant/purch-org mapping in one page. |
| 3 | [TASK_3_Configuration_and_Master_Data.md](TASK_3_Configuration_and_Master_Data.md) | 55 min · 10 steps · highest risk |
| 4 | [TASK_4_Procure_to_Pay.md](TASK_4_Procure_to_Pay.md) | 25 min · 7 steps · fastest points |
| 5 | [TASK_5_Subcontracting.md](TASK_5_Subcontracting.md) | 30 min · 7 steps |
| 6 | [TASK_6_Contract_Processing.md](TASK_6_Contract_Processing.md) | 30 min · 4 steps |
| 7 | [TASK_7_Material_Requirements_Planning.md](TASK_7_Material_Requirements_Planning.md) | 35 min · 10 steps |

Tasks 1 and 2 of the PDF are exam rules and context, not system work — they are folded into the
playbook.

## Reading the markers

| Marker | Meaning |
|---|---|
| 🚨 | Silent killer — fails at evaluation, looks fine on screen |
| ⚠️ | Ordinary pitfall — will usually announce itself, but costs time |
| ⚑ **JUDGMENT CALL** | The exam wording allows two readings. The recommended option and the reasoning are given — decide once, do not re-litigate mid-exam |
| ✅ **Done when** | Objective completion test for the step |

## Recommended run order (not 3-4-5-6-7)

```
0:00  Pre-flight
0:10  Task 3 steps 1-2 only   (plant copy has real runtime — start it early)
0:25  Task 4 complete         (bank the easy points)
0:50  Task 3 steps 3-10
1:30  Task 6 complete
2:00  Task 5 complete
2:30  Task 7 complete
2:52  Final verification sweep, then Confirm completion
```

## Where confidence is lower

These guides are built from the exam text plus standard S/4HANA behaviour. A few things you
should verify against the live system rather than trust blindly:

- **Exact menu/tab positions** for a handful of fields (planned delivery time in a contract item,
  the *Fixed* checkbox on a requisition, the tolerance group field on the BP). Each of these has a
  stated fallback location in the task file.
- **The four JUDGMENT CALL points**: the info-record scale quantity (Task 3.5), the purchasing-org
  company-code assignment (Task 3.2), which components to goods-issue (Task 5.3), and how to steer
  MRP to the contract (Task 7.9). Reasoning is given at each one.
- **SPRO paths** shift slightly between releases. If a path does not resolve, use the SPRO search.

---

*Practice aid only. Nothing here is official SAP courseware.*
