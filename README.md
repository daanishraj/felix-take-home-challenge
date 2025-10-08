
# **Felix: Engineering Challenge**

Welcome to the Felix technical challenge! This exercise is designed to simulate a real-world task that is central to how we work: reviewing a pull request from a colleague.

We believe that great engineers don't just write code, they improve the code and the product thinking of the entire team. This challenge is designed to see how you approach that responsibility.

**Time Limit:** Please try timebox this exercise to **2 hours**. We respect your time and are more interested in your thought process than a "perfect" or complete submission.


---
### **Challenge Setup & Submission Instructions**

Please follow these steps carefully to set up your challenge environment.


1.  **Create Your Repository:**
    *   On this repository page, click the green "**Use this template**" button and select "**Create a new repository**".
<img width="480" height="132" alt="Screenshot 2025-09-18 at 14 51 25" src="https://github.com/user-attachments/assets/2567f5e9-837e-436a-938c-204f93cfd9ef" />


2.  **Include All Branches (Crucial Step):**
    *   When creating your repository, you will see a checkbox for "**Include all branches**".
    *   **It is essential that you check this box.** This will ensure you have the `feature/lateRentPayment` branch needed for the challenge.
<img width="775" height="260" alt="Screenshot 2025-09-18 at 14 52 34" src="https://github.com/user-attachments/assets/1cb88b88-d1ac-4003-94fc-af9181c79c8a" />


3.  **Create the Pull Request:**
    *   Once your repository has been created, create a pull request for the `feature/lateRentPayment` branch
    *   If there is a message saying **There isn’t anything to compare.**, clone the repo and run:

```
git checkout feature/lateRentPayment
git reset --soft origin/main
git commit -m "Initialize feature/lateRentPayment"
git push -f origin feature/lateRentPayment
```
<img width="972" height="145" alt="Screenshot 2025-09-18 at 14 53 22" src="https://github.com/user-attachments/assets/982f3b9b-41a4-4ffa-a87d-168d21d4ea6d" />

4.  **Share Your Work:**
    *   Once your review is complete, you need to share the repository with us. You have two options:
        *   **If you created a PRIVATE repository:** Please invite the GitHub user `jpagand` as a collaborator with "Read" access.
        *   **If you created a PUBLIC repository:** No invitation is needed.
    *   **Finally, please reply to our email with the link to your new repository.**

*If you encounter any issues during this setup process, please don't hesitate to reach out.*

---

### **The Context**

A colleague has been working on a new feature to help property managers track tenants who are late on rent.

They have now opened a Pull Request with their initial implementation following this "Problem to Solve":

### **The Problem to Solve**
Property managers are currently tracking tenants who are late on rent payments using external spreadsheets and manual notes, which is inefficient and error-prone.

During a user interview, a property manager for a large building said:
>I have a spreadsheet where I have to manually mark who has paid and who is late. I need a button in the tenant's profile in your app so I can just mark them as 'Rent is Late'. That way, I can see all the late payers in one place.

To address this, we will implement the feature requested by the user. We will provide property managers with the ability to manually (un)flag a tenant whose rent payment is overdue.

---
### **Your Task**

Your task is to conduct a thorough review of this Pull Request. We want to see how you think, how you communicate your feedback, and how you collaborate to raise the quality of our product and codebase.

Your review should cover all aspects you find relevant, including:
*   **Substance:** Does the solution effectively solve the root problem outlined in the PtS? Is there a better or simpler way to achieve the user's goal?
*   **Form:** Code quality, best practices, potential bugs, and architectural patterns.
*   **Quality:** Test coverage and the overall robustness of the implementation.

### **The Deliverable**

1.  **Provide your feedback directly on the Pull Request.** Use comments, questions, and code suggestions as you would with a real colleague. Your tone and communication style are as important as your technical feedback.

2.  **Propose an alternative.** Do you believe the outilined problem - Property manager need to mark tenant as "Rent is Late" - is the root problem ? If no, please, state the root problem and open your own PR with a proof-of-concept for your solution.

3.  **Submit your notes.** Once you are finished, please add a new file to the repo named `submission.md` with the following information:
    *   A brief summary of how you spent your time (e.g., "45 mins understanding the context and PtS, 60 mins reviewing the code and leaving comments, 15 mins writing my notes").
    *   A list of any assumptions you made.
    *   A few notes on what you would do next if you had more time.

### **Technical Housekeeping**

* `npm i` To install dependencies
* `npm run start` To run the graphql server locally on port 3005
* `npm run test` To run the tests on file changes
* `npm run test:coverage` To run the tests and compute code coverage
*   If your proposed solution involves creating a **new TypeORM entity**, please remember to add it to the `entities` array in `src/connectDB.ts`.
*   If your proposed solution involves creating a **new GraphQL resolver**, please remember to add it to the `resolvers` array in `src/server.ts`.

---

### **Your Feedback on This Challenge**
We are constantly trying to improve our own processes, including this hiring challenge. As a final, optional step, we would be grateful for your honest feedback on this exercise itself. Please feel free to add a section in your `submission.md` file with your thoughts.

For example: Was the time limit fair? Were the instructions clear? Did this feel like a relevant test for a senior engineering role? All feedback is welcome.

---

Thank you for your time and effort. We are excited to see your review and learn how you think.
