# SS-5801-RoomScheduleAndTutorSystem
A room scheduling and tutor system built for the YSU Math Department as part of my  CSCI5801 class. 
The system was built using Amazon Web Services cloud computing.

The system is essentially two seperate entities. The room scheduler dynamically responds to the rooms and times available stored in a database.
It has admin support, room cancellation, and more available.

The tutor scheduler allows for adding and removing tutors as well as editing them in case their availability or classes change. 
It also generates a weekly schedule automatically based on an algorithm that I designed with one of my project partners.
The algorithm attemps to fill in each day while also evenly sharing the time so that tutors are more fairly scheduled.
The schedule quickly notifies the user of the status of a day. Green means it is completely filled and Red means at least one spot is empty.

There are instructions on how to set this up as well as pictures of the system in the various reports.
