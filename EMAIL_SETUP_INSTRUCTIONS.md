# Email Setup Instructions for Contact Form - Using Formspree

Your contact form will send messages directly to **ademodiseun@gmail.com** using Formspree (much easier setup than ElasticEmail!)

## Quick Setup Steps (5 minutes):

### 1. Sign Up for Formspree (FREE)

- Go to **https://formspree.io/**
- Click "Get Started" 
- Sign up with your email (ademodiseun@gmail.com or any email)
- Verify your email address

### 2. Create a New Form

- After login, click "+ New Form"
- **Form Name**: "Portfolio Contact Form"
- **Email**: ademodiseun@gmail.com (where you'll receive messages)
- Click "Create Form"

### 3. Get Your Form Endpoint

- You'll see a URL like: `https://formspree.io/f/xyzabc123`
- Copy this entire URL

### 4. Update Your Code

- Open `src/app/landing/landing.component.ts`
- Find this line (around line 15):
  ```typescript
  private formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
  ```
- Replace `YOUR_FORM_ID` with your actual form ID:
  ```typescript
  private formspreeEndpoint = 'https://formspree.io/f/xyzabc123';
  ```

### 5. That's It! 🎉

Now when someone submits your contact form:
- ✅ You'll receive an email at ademodiseun@gmail.com
- ✅ Email will include: name, email, subject, and message
- ✅ You can reply directly to the sender
- ✅ Free tier: 50 submissions/month

## Testing

1. Save your changes
2. Run `npm start`
3. Go to the Contact section
4. Fill out and submit the form
5. Check your email!

## Formspree Dashboard Features

After setup, you can:
- View all form submissions in the dashboard
- Download submissions as CSV
- Set up custom email templates
- Add spam protection (CAPTCHA)
- Configure auto-reply messages

## Troubleshooting

**"Form not found" error?**
- Make sure you copied the complete Formspree URL
- Check that the form ID is correct in your code

**Not receiving emails?**
- Check your spam folder
- Verify the email address in Formspree dashboard
- Make sure you verified your Formspree account

**Need more submissions?**
- Free: 50/month
- Gold: $10/month for 1000 submissions
- For portfolio, 50/month is usually plenty!

## Why Formspree?

- ✅ Super easy setup (no SMTP configuration)
- ✅ No credit card required for free tier
- ✅ Reliable service
- ✅ Great for portfolios and small sites
- ✅ Handles spam protection
- ✅ Professional and trusted by thousands

## Support

If you have any issues:
- Formspree docs: https://help.formspree.io/
- Or just email visitors directly: ademodiseun@gmail.com
