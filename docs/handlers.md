# Handlers

Carbon offers a mechanism to supply extension points to your JavaScript, allowing developers to supply custom code for different application configurations.

An example would be an application which supports many different locales, each locale may require custom code for particular areas of the application. A developer should be able to add this custom JavaScript without it overriding the original code, and in a way which does not affect the other locales. This can be achieved using extension points and handlers.

## How to Create an Extension Point

Your Carbon application should contain a base handler directory at `/src/carbon-handler`. This will contain all of the application's extension points. To create a new extension point you can use the Carbon CLI command:

```
carbon handler sales_invoices # TODO: need to create this command.
```

This will create extension points for Sales Invoices. If you explore the `/src/carbon-handler/sales-invoices` directory you will find two files:

* `index.js` - This file defines the class for your extension point. This class does nothing except extend from your base class, the point being that developers can override this file to supply their own logic.
* `base.js` - This files defines the basis of your extension point, including methods or parameters that can be customised.

### How to use the Extension Point in your Application

Now you have an extension point, you need to use it in your application. Choose the view in which you want to surface some customisability, - in this example we will use `src/views/sales_invoices/new.js`, and we will allow the ability for developers to supply additional fields to a Table Fields for Many component.

Currently the sales invoices view looks like this:

```js
// /src/views/sales-invoices/new.js

import React from 'react';
import View from 'carbon/utils/view';
import TableFieldsForMany from 'carbon/TableFieldsForMany';
import Textbox from 'carbon/Textbox';

class SalesInvoices extends View {

  render = () => {
    var tableFields = [
      <Textbox name="first_name" />,
      <Textbox name="last_name" />
    ];

    return (
      <div className="ui-sales-invoices">
        <TableFieldsForMany fields={ tableFields } />
      </div>
    );
  }

};

export default SalesInvoices;
```

In our sales invoices extension point we should define a parameter to additional fields for the Table Fields for Many, this will just be an empty array by default:

```js
// /src/carbon-handlers/sales-invoices/base.js

class Base {
  additionalFields = []
}

export default Base;
```

Now lets update the view to use this extension point to add additional fields if they are defined.

```js
// /src/views/sales-invoices/new.js

import React from 'react';
import View from 'carbon/utils/view';
import TableFieldsForMany from 'carbon/TableFieldsForMany';
import Textbox from 'carbon/Textbox';
import Handlers from 'carbon-handler'; // import the handlers

class SalesInvoices extends View {

  render = () => {
    var tableFields = [
      <Textbox name="first_name" />,
      <Textbox name="last_name" />
    ];

    // concatenate the fields array with the fields from the handler:
    tableFields = tableFields.concat(Handlers.SalesInvoices.additionalFields);

    return (
      <div className="ui-sales-invoices">
        <TableFieldsForMany fields={ tableFields } />
      </div>
    );
  }

};

export default SalesInvoices;
```

Thats it! A developer can now easily add additional fields to this view using the extension point. To do that they will need to create a handler.

## How to Create a Handler

### Initial Setup

So how does a developer leverage this extension point? They will need to create a seperate node module to contain the handler, this separates the code from the core codebase and keeps the complexity low. To work properly the name of the module/handler needs to be prefixed with `carbon-handler-` - for our example we will create a handler called `carbon-handler-uki`, as if we want to supply custom code for a UKI configuration of the application.

You can create a new node module by running `npm init` in the directory in which you want to create it (the directory or GitHub repo's name does not have to match the node module's name).

Once your node module is created, you can prepare it as a Carbon handler by running the following:

```
carbon prepare handler # TODO: need to create this command.
```

We also need to tell our original application about this new module, add it as a dependency:

```
npm install sage/carbon-handler-uki --save
```

### Leveraging the Extension Points

Now your handler is setup, you can easily add new code to leverage the extension points. You can run the following to scaffold the required files:

```
carbon handler sales_invoices # TODO: need to create this command.
```

This will create files to use the extension points for Sales Invoices. Lets modify the `additionalFields` parameter to add the additional fields required for the UKI:

```js
// /src/sales_invoices/index.js

import Base from 'base-handler/sales_invoices/base'; // imports the base class so we can extend from it and update only the parameters we want
import React from 'react';
import Textbox from 'carbon/Textbox';

class SalesInvoiceHandler extends Base {
  additionalFields = [
    <Textbox name="description" />
  ]
};

export default new SalesInvoiceHandler;
```

Now we can run the Gulp command to build the assets, and tell it to use our new handler:

```
gulp --handler uki
```

This will compile an asset taking into account the UKI handler.
