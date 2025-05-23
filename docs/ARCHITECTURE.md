## Data Models (linked from models.types.ts)
- IUser: Registered user schema
- IPlan: Investment plan details
- IDeposit: Deposit records
- IInvestment: Tracks user investments
- IWithdrawal: Tracks user withdrawal requests

## Flow: User Investment
1. User signs up and agrees to terms.
2. Referrals are tracked if any.
3. User deposits funds.
4. User selects an investment plan.
5. System starts a daily return tracking mechanism.
6. Admin can approve/reject deposits/withdrawals.

## Security Considerations
- Hashing using bcrypt (passwords, CNIC, etc later maybe.)
- Admin/mod actions are tracked via `modifiedBy` and `processedBy`

## Roles
- `user`: can deposit, invest, withdraw
- `admin`: can verify transactions
- `superadmin`: can manage admins and override access
