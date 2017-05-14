import _ from 'lodash';

const MaterialThickness = [
  '1/16"',
  '1/8"',
  '3/16"',
  '1/4"',
  '3/8"',
  '1/2"'
];

const SheetMetalGage = [
  '30',
  '28',
  '26',
  '24',
  '22',
  '20',
  '18',
  '16',
  '14',
  '12',
  '10'
];

export const Area = [
  '1ft x 1 ft',
  '1ft x 2ft',
  '2ft x 2ft',
  '2ft x 4ft',
  '4ft x 4ft',
  '4ft x 8ft',
  'Other'
];

export const Color = [
  'Clear',
  'Black',
  'White',
  'Red',
  'Yellow',
  'Orange',
  'Green',
  'Blue'
];

export const Tolerance = [
  '2-6mm',
  '1-2mm',
  '1mm-500μm',
  '500μm-200μm',
  '200-100μm'
];

export const Materials = [
  {
    label: 'Metal',
    types: [
      'Aluminum 5052',
      'Aluminum 6061',
      'Aluminum 6063',
      'Aluminum 7075',
      'Cold rolled Steel 1083',
      'Hot rolled Steel',
      'Stainless Steel 304',
    ],
    thicknesses: MaterialThickness.concat(SheetMetalGage)
  },
  {
    label: 'Plastic',
    types: [
      'Acrylic',
      'Delrin',
      'Coroplast',
      'Polycarbonate',
      'Abs',
    ],
    thicknesses: MaterialThickness,
    colors: Color
  },
  {
    label: 'Woods and Fiberboards',
    types: [
      'Birch Plywood',
      'Walnut Plywood',
      'Bamboo Ply',
    ],
    thicknesses: MaterialThickness
  },
  {
    label: 'Paper and Cardboard',
    types: [
      'Paper',
      'Cardboard',
      'Pressboard',
    ]
  },
  {
    label: 'Fabric',
    types: [
      'Fabric',
      'Silk',
      'Cotton',
      'Felt',
      'Ripstop nylon',
      'Leather',
    ],
    thicknesses: MaterialThickness,
    colors: Color
  },
  {
    label: 'Composites',
    types: [
      'Mylar',
      'Fiber glass',
      'Carbon fiber',
      'MDF',
    ]
  },
  {
    label: 'Ceramic and Glass',
    types: [
      'Glass',
      'Ceramic',
    ],
    thickness: MaterialThickness
  }
];
export const MaterialsByLabel = _.keyBy(Materials, 'label');

