# Lead form for React Native
[![npm](https://img.shields.io/npm/v/github-buttons)](https://www.npmjs.com/package/react-native-lead-form)
> First you need to create an account with [Boontar TV](https://boontar.tv)

<p align="center">
  <img width="250" height="auto" src="https://boontarcloud.azureedge.net/others/lead_form_openapi.png" alt="Sublime's custom image"/>
</p>

## Features
 - You can use your own style classes
 - Install the module and start collecting requests, ratings, reviews
 - Admin panel for viewing incoming requests [Boontar TV](https://boontar.tv)
 - Export requests
 - Embedded analytics

## Admin panel
List of incoming requests in the admin panel [Boontar TV](https://boontar.tv)

[![Boontar TV - Lead Form Builder](https://boontarcloud.azureedge.net/others/react-lead-form-widget.png)](https://boontarcloud.azureedge.net/others/react-lead-form-widget.png)
 
## Getting Started
1. Create a key **without site URL** on the admin panel
2. Install the module, run the following in the command line:
```bash
npm i react-native-lead-form --save
```
Use within your application with the following line of JavaScript:
```js
import LeadForm from 'react-native-lead-form'
```
## Available props
| Name | Type | Required | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| `getId` | `number` | `Yes` | - | Lead form unique ID at Boontar TV |
| `apiKey` | `string` | `Yes` | - | Key that you generate in the admin panel [Boontar TV](https://boontar.tv) |
| `inputLabel` | `string` | `No` | - | Custom style for InputLabel |
| `input` | `string` | `No` | - | Custom style for inputs |
| `submitButton` | `string` | `No` | - | Custom style for button |
| `submitButtonText` | `string` | `No` | - | Custom style for text in submit button |
| `successText` | `string` | `No` | - | Custom style for success notification |
| `failedText` | `string` | `No` | - | Custom style for failed notification |
| `container` | `string` | `No` | - | Custom style for main container |
| `title` | `string` | `No` | - | Custom style for title |
| `desc` | `string` | `No` | - | Custom style for description |
| `inputsContainer` | `string` | `No` | - | Custom style for form container |
| `buttonContainer` | `string` | `No` | - | Custom style for button and notification block |
| `placeholderTextColor` | `string` | `No` | - | Custom text color for placeholder in inputs |
| `statusVisible` | `boolean` | `Yes` | `true` | Show form submission status |
| `successStatus` | `string` | `No` | `Form sent successfully` | Text on success |
| `failedStatus` | `string` | `No` | `Failed to submit form` | Text on failed |
| `requiredStatus` | `string` | `No` | `You have not filled in the required fields` | Text if all required fields were not filled |
| `validateStatus` | `string` | `No` | `Check the correctness of the filled data` | Text if email or phone types fail validation |
| `onSuccess` | `func` | `No` | - | Callback function after successful form submission |
| `onFailed` | `func` | `No` | - | Callback function after failed form submission |
| `onLoad` | `func` | `No` | - | Callback function after the lead form is loaded |
| `onLoadFailed` | `func` | `No` | - | Callback function if lead form fails to get |
## Error codes
| Code | Description |
| ------ |  ------ |
| `1` | Failed to submit form |
| `2` | Required fields not filled |
| `3` | Not correct email |
| `4` | Not correct phone number |
## Available input fields
| Name | Included |
| ------ |  ------ |
| `Text` | ✅ |
| `Number` | ✅ |
| `Date & Time` | ❌ |
| `Date` | ❌ |
| `Time` | ❌ |
| `Slider` | ❌ |
| `Select` | ❌ |
## Example
```js
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';

import LeadForm from 'react-native-lead-form'

class HelloWorld extends Component {
  
    onSuccess = () => {

    }

    onFailed = (errorCode) => {
      console.log(errorCode)
    }

    render() {
        return(<SafeAreaView>
		  <LeadForm
			getId={489} 
			apiKey={'3eed5899edebff1197ae59dc06651ff929a10297'}
			statusVisible={true}
			onSuccess={()=>{}}
			onFailed={(errorCode)=>{}}
		  />
   	 </SafeAreaView>)
    }
}
```
