# Security Specification for California Pulse Network (Firebase Security TDD)

## 1. Data Invariants

- **Subscriber Emails & PII**: Subscriber email signups must require mandatory email and cityId fields. Read, update, and delete access to subscribers is strictly forbidden from client SDKs to prevent query scraping or email harvest attacks.
- **Sponsorship Inquiries**: Advertising reservation queries are write-only from the client. No listing or editing is allowed without service user context.
- **Dynamic Blogs & Towns metadata**: Active blogs, articles, and municipal descriptions are open to public read (`get` and `list`) so the landing page functions fast and is fully SEO friendly. Modification is closed on the client.

---

## 2. The "Dirty Dozen" (Attack Vector Payloads)

Here are twelve payloads designed to test our ruleset limits. The rule engine must reject all twelve.

1. **Identity Spoof (Subscriber ID hijack)**: Injecting arbitrary field `isAdmin: true` into the subscriber payload.
2. **Missing Email (Subscriber registration)**: Submitting a subscriber with interest mappings but omitting the email.
3. **Poison Strings (ID Injection)**: Submitting a subscriber with an ID of 100kb filled with special script chars.
4. **Client Timestamp Fraud**: Sending a custom `createdAt` representing a date in 2030 instead of `request.time`.
5. **PII Query Scraping**: Attempting a `list` query on the `subscribers` collection.
6. **Self-Promotion to Sponsor Admin**: Creating or overwriting a city document directly to change its name or stats.
7. **Article Poisoning**: Deleting an article or appending markdown injection strings.
8. **Shadow Field Injection**: Submitting an inquiry with an unauthorized field `revenueTier: 1000`.
9. **Junk Package Inquiry**: Sending a sponsor inquiry with pricing string sized over 1MB.
10. **Coming-Soon Bypass**: Modifying a city configuration to force an inactive city to appear active.
11. **Negative Counters**: Attempting to send subscriber offsets with negative integers.
12. **Malicious Empty Fields**: Submitting empty strings for mandatory advertiser names or business names.

---

## 3. Test Runner Design

The security model is validated against rules compiled with rules_version '2'. All client writes that do not match the required schemas are strictly blocked, while readers can access city attributes.
