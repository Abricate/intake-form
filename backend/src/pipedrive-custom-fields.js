import _ from 'lodash';
import pipedrive from './clients/pipedrive';

const customFields = {
  'Files': 'text',
  'Material': 'varchar',
  'Color': 'varchar',
  'Material Thickness': 'varchar',
  'Comments': 'text',
  'Quantity': 'double',
  'Due Date': 'date',
  'Shipping Address': 'text',
  'CM: Catalog Link': 'varchar',
  'CM: Product Name': 'varchar',
  'CM: Product ID': 'varchar',
  'CM: Dimensions': 'varchar',
  'CM: Price': 'varchar',
  'CM: MSDS Link': 'varchar',
  /** for invoicing */
  'Unit Price': 'monetary'
};

const customFieldKeys = (getDealFields = pipedrive.DealFields.getAll) => {
  console.log("CustomFieldKeys");

  return getDealFields().then( fields => {
    const pairs = fields.filter( field =>
      customFields.hasOwnProperty(field.name)
    ).map( field =>
      [field.name, field.key]
    );

    const existingFields = _.fromPairs(pairs);

    const missingFieldNames = _.difference(_.keys(customFields), _.keys(existingFields));
    console.log("missing field names", {missingFieldNames, existingFields});
    return Promise.all(
        missingFieldNames.map(name => {
        const field_type = customFields[name];
        return pipedrive.DealFields.add({ name, field_type }).then( field => [name, field.key] );
      })
    ).then(_.fromPairs).then( missingFields => ({
      ...existingFields,
      ...missingFields
    }));
  })
};

let result = undefined;

export default customFieldKeys();

/*() => {
  if(result !== undefined) {
    return result;
  } else {
    result = customFieldKeys();
    return result;
  }
};
*/
