> **Note:**  
> I did not have the time to focus on testing.  
> 
> Initially, the task was marked as a *2-hour challenge*, and my approach was developed with that time constraint in mind.  
> 
> Since the mention of the 2-hour limit has now been removed, it is not completely clear to me what the exact expectations are.  
> 
> However, I have completed the following tasks:


1. **Feedback on PR**: can be found directly on open PR [here](https://github.com/daanishraj/felix-take-home-challenge/commit/97da5931124103ebf197018f2a9807112c9d5cff)


2. **Alternative**: The PtS states: ""I have a spreadsheet where I have to manually mark who has paid and who is late. I need a button in the tenant's profile in your app so I can just mark them as 'Rent is Late'. 
That way, I can see all the late payers in one place."
 Earlier, the property manager had to manually mark each tenant who's name he had stored in a spreadsheet. That's tedious. Now, he is proposing a button in the tenant's profile so he can flag them there. 
 With this feature, the difference is that he does not need to go to the spreadsheet. However, he still has to manually mark each tenant in the app. I suppose he needs to do this one by one. 
So, to me it seems that the root of the problem is the landlord having to manually flag each tenant, be it in a spreadsheet or by clicking a button on the profile. So a more robust fix for this 
would be to automate how a tenant is flagged as a late payer.
I have implementedt this automatic flagging of tenant's rate lent status in a simple POC on a new branch. Please see [here](https://github.com/daanishraj/felix-take-home-challenge/commit/39661ed8c9cbea5e3d69f169e0ef2705e464acf2)



3. **How Time Was Spent (All approximate):** 


- **45 mins** — Understanding the PtS & reviewing the code, understanding different entities and relationships that exist  
- **15 mins** — Trying to understand syntax, code & functionality related to GraphQL and TypeORM  
- **30 mins** — Asking clarifying questions and thinking about them  
- **60 mins** — Reviewing the PR and making comments, taking personal notes  
- **60 mins** — Thinking about solution to the root of the problem, implementing simple POC, thinking of what else could be done  
- **30 mins** — Completing `submission.md`


4. **What else could be done / Other thoughts**

- **Reason for not many code suggestions in comments:**  
  I treated this PR as a real PR I am working on. I usually prefer to give the author of the PR a chance to respond to a comment with their thoughts or code changes before suggesting my own.

- **Cron job automation:**  
  Depending on the business need, it might make sense to set up a cron job that runs periodically and computes which tenants are late in paying rent.  
  This way, the status is readily available to the property manager at all times.  

  However, this comes with some complications — for example:
  - There’s more dependency between entities.  
  - When payments are created or updated, `isRentLate` would need to be recomputed.  
  - Such updates might need to be wrapped in transactions to ensure database consistency.

- **Extend feature for apartment-level insights:**  
  The current feature enables the property manager to mark and see all the tenants that are late at a point in time.  
  It might make sense to extend this so that the property manager can also see a list of **apartments** where rent is still due.

- **Performance optimization:**  
  If we expect the property manager to query late tenants very often, we could consider adding an **index** to the relevant field for faster lookups.
