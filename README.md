This project implements a bunch of financial vehicles that can then be combined to do various projections.
There is not yet a direct plan to do end-to-end scenarios, the goal is just a set of APIs to facilitate e2e analysis.

Concepts:
Everything is centered around an IAsset that builds a tick-based conditional model. A tick is standardized to be 1 month, because it's unusual for long-term planning to need more granularity than that. The model uses ticks (as opposed to point-in-time) because the idea is to map the motion of assets per month. With a point-in-time model, the burden is placed on both the engine to track time directly, as well as on the IAsset developer to support arbitrary time windows. In other words, a monthly tick-based model seems to be a good simplification of reality for consumer and developer alike. All operations should be done in present-day money.

There are a large set of IAsset implementations. Each takes necessary initial data through its constructor, and can of course expand on functionality as desired. Some of the existing IAssets are:
1. Salary - a monthly salary, possibly with growth factored in
2. AnnualBonus - an annual bonus of known size, given in one month of the year
3. Cash - it is what it is, ya know?
4. Investment - money invested that grows at a specified rate
5. MaturingInvestment - like an investment, but not available until a specified date (eg: a 401k)
6. Income - a compound IAsset that can wrap salaries and bonuses and apply income taxes
7. PercentagePull - a wrapper to do things like direct month from Income to a 401k
Refer to each IAsset type's unit tests for examples of how they are intended to be used.

Missing concepts:
Global rate of inflation
Property
Investment property
HSA
Cost - such as monthly rent, bills, vacations, children, medical, etc
Social Security - as an income. Ideally it can be tied to the data pulled from income





