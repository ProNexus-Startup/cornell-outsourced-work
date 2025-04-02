# cornell-outsourced-work

There are 2 components to this project:
1. Python backend functionality
  - MAIN GOAL: Upend our current mechanisms for tagging meta experts themselves and tagging jobs to allow for simultaneous semantic and literal search. Make a method for algorithmically vectorizing relevant tag and job information. Make a method for returning relevant meta-experts based on filtered jobs and tags. 
  - CONSIDERATIONS:
      * We have a separate backend which deals with calls to our database so use a sample json/txt file for sample data, obtained in my backend_interaction.py functions
      * Filtering on certain fields is literal (seniority, industry)
      * Filtering on other fields is semantic (tag values)
      * Incorporate our startdate, frequency, and location variables in each field (allow them to be ignored) as further filters
      * Location filtering should allow a user to select an area of any specificity (i.e., city, principality, region, country, subcontinent, continent) and include any parent locations (e.g., if US is chosen, any US state should be selected as well)
      
2. Frontend
  - MAIN GOAL: Finish the frontend implentation of the frontend app, inspired by LinkedIn's recruiter tool (https://www.youtube.com/watch?v=S6mVwmCHShk), Juicebox's people GPT (https://juicebox.ai/), and Happenstance's tool (https://happenstance.ai/). This is mostly done, we just need caching and a literal "which experts to show" filter from python 
  - CONSIDERATIONS:
      * This should get experts from the python backend and render those in the filter.
      * There should be a caching mechanism for saving user's filter queries from the backend given they take a long time to calculate for semantic filtering.

If you need data definitions, you can find them here: https://docs.google.com/document/d/1Zk9NCGt5W0rRxlzYyn0zWhKGNUV4mBOm5R5sKlvGdlQ/edit?usp=sharing
It's updated routinely based on our conversations to explain the data structures we work with.
