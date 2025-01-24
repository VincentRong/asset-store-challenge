## Changes:
### Frontend：
- Pass product through URL parameter.
   - Reason: The product name is required on the product detail page.
   - Options Considered: 
      - Opton A: Fetch product name and price from the backend in single request
        - Pros: Simplifies frontend logic; allows for easy addition of fields in the future
        - Cons: Requires cache management and may necessitate fetching the entire product list (this can be changed if we could request the full information of single one product); price might be sensitive data which needs to be real time, so cache or not might depend on business requirement.
      - Option B: Pass data parameter from front end
        - Pros: Simplifies backend logic.
        - Cons: URL becomes cluttered as more fields are passed.
   - Decision: Go with Option B for simplicity
   - Test: Manual validation via spot checks on the frontend.
### Backend:
- Use `axios` to integrate the legacy-api, so that easy to handle response and mock test
    - test: integration test
- Use `express-validator` to validate the product id as integer
    - test: unittest
- Extract application logic into `app.ts`, so as to be unittested, and also make the entry file `index.ts` clearer.
- Add `productClient.ts` for delegating the operations of getting product info, and add `redis` as cache to reduce network requests to legacy server.
   - The redis cache should be overwritten if the product info is change (e.g, external service change price of specific product)
   - After we cache the result from legacy-api, the application has more capacity to server more than 10 request / s. Installed [`oha`](https://github.com/hatoo/oha), run load test command: `oha -n 50 -q 15 http://localhost:8080/` and see result `Requests/sec: 12.8605`.
- Write unittest `app.test.ts`, also configure the jest test.
    - npm run test
- `ratelimiter/` : use an Nginx with limit_req_zone, deploy as a `legacy-backend-rl` proxy of legacy server to limit the request rate and line to legacy server, so that we won't exceed the 5 request/s limit to get error reponse.
   - test: We filtered all the 100 product ids and formated as `http://localhost:8080/products/${id}`, saved as `product_urls.txt`, then ran load test command: `oha --urls-from-file product_urls.txt -n 80 -q 15` and check all logs good. Because all the price requests are without redis cache at that moment, all the requests will go to `legacy-api`, and we could see the log of ratelimiter such as `delaying request, excess: 32.335, by zone "legacy_limit"`.
- Write integration test in `backendTest/` and deploy as `backend_integration_test` to ensure the APIs working well. We can manually run this container for integration test after all services up. (And potentially for some scheduled triggers)

## Future improvements:
If we have more time, we can make further improvements as below.
- Code Quality: Add linting to enforce code style best practices.
- Testing:
  - More unittest coverage on backend codes.
  - Add unit and snapshot tests for the frontend.
  - Implement end-to-end tests using tools like Cypress.
  - Hand test scripts for all test methods.
- Error Handling
  - Standardize server-side error and exceptions
  - Enahnce frontend error handling
- Performance Optimization: Avoid unnecessary network requests and page reloads when returning to the homepage to improve response time
- Commit Granularity: break down large changes into smaller commits for better traceability and easier reviews.