MVP:

DONEUser visits the homepage and is able to login/signup.

DONESign up with email address and password.

Complete profile in order to send letters and browser users: - gender (male/female/nonbinary) - very short bio (will have minimum character length) - Date of birth (age found automatically) - username - coordinates (latitude and longitude via geolocation, through the browser asking for this) --> will automatically populate the city,state, country after this is done. - completing profile creates a new user with a unique username who is added to a DynamoDB table along with their email.

Browse profiles: - all users displayed, in any order at this point - nickname, age, location (city, state, country) - ability to click a button to send a letter

Send letter: - nickname auto-filled out - write letter with CHARACTER MINIMUM ATTACHED - confirmation before sending: are you sure you want to send, it will take time to be delivered?

Inbox: - Read tab, - Delivered tab - Unread tab/new tab, - Incoming tab (also displaying a countdown until letter delivery, and from whom the letter is from) - Sent tab (also displaying countdown until letter delivery, and the recipient)

Assorted Features:

    - The duration of letter delivery is calculated based on distance between the two people.
    - There is a minimum delay of at least one day (24 hours)
    - Email notification whenever:
        - Someone has sent a letter to the user (who has sent it and from where)
        - Letter delivered (who has sent it and from where)

    Notifications for the arrival of letters

Future thoughts:

    - Ability to block users
    - Ability to report letters
    - Switch modes -- flat delay instead of distance-based
    - Creation of avatars for each person (important feature!!!)
    - Addition of languages for each person, and any corresponding suport for them
    - Last logged-in date visibility
    - Filters for choosing users from /users

+++++++++++++++++++++++++++++++++++++++

Basic Idea: be penpals online, delay included.
Letters take time to be delivered to encourage more thoughtful communication.
Time taken for delivery depends on geographical distance -- subject to change (maybe better idea for it to just have a short delay?)
