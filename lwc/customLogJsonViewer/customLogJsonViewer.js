/*
** LWC to display a JSON in a nicer way
** Developer: Aaron Dominguez - aaron.dominguez@salesforce.com
** Date: 13/07/2021
*/ 

import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { loadScript } from 'lightning/platformResourceLoader';
import jsResource from "@salesforce/resourceUrl/jsontool";

import LOGMESSAGE_FIELD from '@salesforce/schema/Custom_Log__c.Contents__c';

const fields = [LOGMESSAGE_FIELD];

export default class CustomLogJsonViewer extends LightningElement {
    @api recordId;

    loaded = false;

    @wire(getRecord, { recordId: '$recordId', fields })
    customLog;
    
    get logMessage() {
        return getFieldValue(this.customLog.data, LOGMESSAGE_FIELD);
    }

    // Deferred initialization due to wired props
    init() {

        if (this.loaded)
            // Load and display the json viewer        
            mount(this.template.querySelector("div"), {
                jsonText: this.logMessage,
                reactJsonViewProps: { name: false, displayDataTypes: false }
            });

    }

    //-- LIFECYCLE HOOKS
    // Load script
    connectedCallback() {

        if (this.loaded)
            return

        Promise.all([
            loadScript(this, jsResource)
        ]).then(() => {
            console.log("jsonviewer loaded.")
            this.loaded = true;
            this.init();
        })
        .catch(error => {
            console.log(error);
        });

    }

    // Wired props ready, invoke init
    renderedCallback() {

        this.init();

    }
}