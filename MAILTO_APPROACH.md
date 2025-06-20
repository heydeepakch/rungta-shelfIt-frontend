# Contact Seller - Mailto: Approach

This document explains how the "Contact Seller" functionality works using the `mailto:` protocol.

## How It Works

When a user clicks "Contact Seller" on any ad:

1. **Form Opens**: A modal opens with fields for:
   - User's name
   - User's email
   - Custom message

2. **Email App Opens**: When the user clicks "Open Email App":
   - The device's default email app opens automatically
   - Seller's email address is pre-filled in the "To" field
   - Subject line is pre-filled with ad title
   - Message body includes user's inquiry and contact details

3. **User Sends Email**: The user can:
   - Review and edit the email before sending
   - Send the email directly from their own email account
   - The seller receives the email at their registered email address

## Benefits

✅ **No Backend Email Service Required**
- No SendGrid, Gmail, or other email service setup needed
- No API keys or credentials to manage
- No email delivery issues or spam filters

✅ **Works on All Devices**
- Desktop: Opens default email client (Outlook, Thunderbird, etc.)
- Mobile: Opens default email app (Gmail, Mail, etc.)
- Web: Opens web-based email if configured

✅ **User Privacy**
- Users send emails from their own email accounts
- No need to share personal email credentials
- Direct communication between buyer and seller

✅ **Simple Implementation**
- No server-side email processing
- No email service dependencies
- Standard web protocol (mailto:)

## Technical Implementation

The `mailto:` link is constructed with:
- **To**: Seller's email address
- **Subject**: "Inquiry about: [Ad Title]"
- **Body**: Pre-formatted message with user's inquiry and contact details

Example mailto link:
```
mailto:seller@example.com?subject=Inquiry%20about%3A%20MacBook%20Pro&body=Hi%20John%2C%0A%0AI'm%20interested%20in%20your%20MacBook%20Pro...
```

## User Experience

1. User clicks "Contact Seller" button
2. Modal opens with pre-filled form
3. User can customize their message
4. User clicks "Open Email App"
5. Default email app opens with everything pre-filled
6. User reviews and sends the email
7. Seller receives email directly

## No Setup Required

This approach requires zero configuration:
- No email service accounts
- No API keys
- No environment variables
- No server-side email processing
- Works immediately after deployment

## Compatibility

- ✅ All modern browsers
- ✅ All operating systems (Windows, Mac, Linux)
- ✅ All devices (desktop, tablet, mobile)
- ✅ All email clients and apps 