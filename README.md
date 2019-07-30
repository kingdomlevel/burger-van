# burger-van
## Shopping basket task for coding challenge

I've thrown together a quick website for a mock-shopping basket for a burger van. It can be found here:
[https://www.shamgate.co/burger-van](https://www.shamgate.co/burger-van).


### Discounts
I am handling discounts in 2 ways:
1. **Item-specific discounts**:  just now there is only one, and that is buy-one-get-one-free. This is applied on the *Item* object itself.
2. **Cart-wide discounts**: These are discounts that are applied at the "whole cart" level. There are 2 of these for now: 
    1. 2% off if you say you have a loyalty card;
    2. 10% off if you spend more than £20.

### Further Work
Aside from the obvious lack of checkout etc, there are a number of ways this small project could be improved:
 - There is repeated markup: the name and price of each product is "hard-coded" into both visible HTML and element attributes. This could be defined in one place and read from the same place in order to minimise errors. A framework e.g. Angular would make work like this much easier.
  - The cart does not show what discount has been applied, how much the customer has saved, etc.
  - There is no use of e.g. localStorage in order for the contents of a cart to persist across sessions.
  - Rounding errors: I have not done any great analysis on the way dscounts affect rounding etc. In a real-world situation this would be given some more thought.
  - If this application was expanded, it would make sense to structure the JS application code into different files, etc.
