import _ from 'lodash';

import { Invoice, InvoiceLineItem, createInvoice } from '../../db';
import { mustBeAdmin } from './';
import { badRequest, notFound } from '../../error';
import { setDifference } from '../../util';

const router = require('express-promise-router')();

router.use(mustBeAdmin);

/**
 * POST /admin/invoices
 *   {
 *     shippingAddress <json>,
 *     billingAddress <json>,
 *     shippingCost <decimal>,
 *     lineItems: <array of LineItems>
 *   }
 *   
 *   LineItem:
 *   {
 *     props: <json>,
 *     quantity: <integer>,
 *     unitPrice: <decimal>
 *   }
*/
const invoiceKeys = new Set([ 'shippingAddress', 'billingAddress', 'shippingCost', 'lineItems' ]);
const lineItemKeys = new Set([ 'props', 'quantity', 'unitPrice' ]);
router.post('/', async function (req, res, next) {
  const { lineItems, ...invoiceProps }  = req.body;
  
  const missing = setDifference(invoiceKeys, new Set(Object.keys(req.body)));

  if(!_.isEmpty(missing)) {
    return next(badRequest('Missing required fields ' + Array.from(missing).join(', ')));
  }

  for( const idx in lineItems ) {
    const item = lineItems[idx];
    const missingLineItemProps = setDifference(lineItemKeys, new Set(Object.keys(item)));

    if(!_.isEmpty(missingLineItemProps)) {
      return next(badRequest('Line item ' + idx + ' is missing required fields ' + Array.from(missingLineItemProps).join(', ')));
    }
  }
  
  const invoice = await createInvoice(invoiceProps);

  for( const idx in lineItems ) {
    const item = lineItems[idx];
    const invoiceLineItem = _.pick(item, Array.from(lineItemKeys));
    console.log(invoiceLineItem);
    await InvoiceLineItem.create({
      invoiceId: invoice.id,
      ...invoiceLineItem
    });
  }

  res.send({ identifier: invoice.identifier });
});

router.get('/by-id/:invoiceIdentifier', async function(req, res, next) {
  if(!req.params.invoiceIdentifier) {
    return next(badRequest('Specify invoice identifier'));
  }
 
  const invoice = await Invoice.find({
    where: { identifier: req.params.invoiceIdentifier },
    include: [ InvoiceLineItem ]
  });

  if(!invoice) {
    return next(notFound());
  }
  
  res.send({
    date: invoice.createdAt,
    shippingAddress: invoice.shippingAddress,
    billingAddress: invoice.billingAddress,
    shippingCost: invoice.shippingCost,
    lineItems: invoice.invoice_line_items.map( item => ({
      props: item.props,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  });
});

module.exports = router;
