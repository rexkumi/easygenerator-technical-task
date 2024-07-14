# easygenerator-technical-task

##Environment Variables set in the config file:
HOME_REDIRECT_URL 

ALERT_TEXT_PATH

APPLICATION_PATH

IFRAME_SOURCE

### Running the suite

To install all required packages locally run the following:
```
npm install
```
To run the task.html file:
```
npm run serve
NOTE: Please run the above before running the tests
I have used http-server to server the html file as it is a popular easy to install and use utility
```

To open Cypress in interactive desktop mode run the following:
```
npm run cypress:run:interactive
```
To run the tests on all browsers in parallel via CLI run the following:
```
npm run cypress:run:tests

NOTE: I used the third party plugin "concurrent" as it allows for the user to execute multiple npm scripts at the same time
```

To run the tests on individual browsers via CLI run the following:
```
npm run cypress:run:headless:edge
npm run cypress:run:headless:chrome
npm run cypress:run:headless:firefox

```
### FYI
Cypress-mochawesome-reporter plug in is used as the custom reporter for the test runs. This will produce a history of html reports in the reports directory

There are 3 known test failures when uploading a non image file to the file uploader element. I have created the tests this way to simulate an actual failure as the uploader should only be for image files