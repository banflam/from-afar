TODO: MAKE THE APP LOOK NICER + DEPLOY THROUGH AWS!!!
MVP:

DONEUser visits the homepage and is able to login/signup.

DONESign up with email address and password.

DONEComplete profile in order to send letters and browser users: - gender (male/female/nonbinary) - very short bio (IGNORE FOR NOW -- will have minimum character length) - Date of birth (age found automatically) - username - coordinates (latitude and longitude via geolocation, through the browser asking for this) --> will automatically populate the city,state, country after this is done. - completing profile creates a new user with a unique username who is added to a DynamoDB table along with their email.

DONEBrowse profiles: - all users displayed, in any order at this point, anything goes for now there should just be a way to click and open the link on it - nickname, age, location (city, state, country) - ability to click a button to view profile (and then send a letter if you so choose)

DONEView user: - Link to send letter page

DONESend letter: - nickname auto-filled out - write letter (IGNORE FOR NOW -- CHARACTER MINIMUM ATTACHED) (IGNORE FOR NOW -- confirmation before sending: are you sure you want to send, it will take time to be delivered?)

DONEInbox: - Read tab, - Delivered tab - Unread tab/new tab, - Incoming tab (also displaying a countdown until letter delivery, and from whom the letter is from) - Sent tab (also displaying countdown until letter delivery, and the recipient)

DONEAssorted Features:

    - DONE The duration of letter delivery is calculated based on distance between the two people.
    - DONE There is a minimum delay of at least one day (24 hours)

Future thoughts:

    - Ability to block users
    - Ability to report letters
    - Switch modes -- flat delay instead of distance-based
    - Creation of avatars for each person (important feature!!!)
    - Addition of languages for each person, and any corresponding suport for them
    - Last logged-in date visibility
    - Filters for choosing users from /users
    - Email notification whenever:
        - Someone has sent a letter to the user (who has sent it and from where)
        - Letter delivered (who has sent it and from where)

+++++++++++++++++++++++++++++++++++++++

Basic Idea: be penpals online, delay included.
Letters take time to be delivered to encourage more thoughtful communication.
Time taken for delivery depends on geographical distance -- subject to change (maybe better idea for it to just have a short delay?)
