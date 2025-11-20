import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// County mapping: maps database "county" values to proper geographical counties
const countyMapping: { [key: string]: string[] } = {
  'dorset': ['Poole', 'Bournemouth', 'Dorset', 'Wareham', 'Weymouth', 'Blandford Forum'],
  'greater-manchester': ['Greater Manchester', 'Manchester', 'Oldham', 'Stockport', 'Salford', 'Bury'],
  'devon': ['Devon', 'Plymouth', 'Exeter', 'Torpoint', 'Totnes', 'Newton Abbot', 'Taunton', 'Cullompton', 'Exmouth', 'Dawlish', 'Brixham', 'Honiton'],
  'norfolk': ['Norfolk', 'Norwich', 'Wells-next-the-Sea', 'Dereham'],
  'bristol': ['Bristol'],
  'east-sussex': ['East Sussex', 'Brighton', 'Eastbourne', 'Bexhill-on-Sea', 'Hastings', 'Lewes'],
  'aberdeenshire': ['Aberdeenshire', 'Aberdeen', 'Ballater', 'Stonehaven'],
  'swansea': ['Swansea'],
  'greater-london': ['Greater London', 'London', 'Enfield'],
  'west-yorkshire': ['West Yorkshire', 'Leeds', 'Bradford', 'Wakefield', 'Brighouse', 'Hebden Bridge', 'Keighley', 'Shipley'],
  'glasgow-city': ['Glasgow'],
  'belfast': ['Belfast', 'Belfast, Antrim'],
  'nottinghamshire': ['Nottingham', 'Mansfield', 'Worksop'],
  'north-yorkshire': ['York', 'Harrogate', 'Malton', 'Ripon', 'Skipton'],
  'east-riding-of-yorkshire': ['Hull', 'Bridlington'],
  'cornwall': ['Cornwall', 'Falmouth', 'Penzance', 'Newquay', 'Saint Austell', 'Saint Columb', 'Redruth', 'Camborne', 'Hayle', 'Wadebridge', 'Camelford', 'Bude'],
  'west-midlands': ['Wolverhampton', 'Stourbridge', 'Kidderminster'],
  'cambridgeshire': ['Cambridge', 'ELY', 'Peterborough'],
  'highland': ['Highland', 'Thurso', 'Cromarty', 'Portree', 'Kingussie', 'Nairn', 'Dingwall', 'Gairloch', 'Invergarry', 'Mallaig'],
  'hampshire': ['Portsmouth', 'Hampshire', 'Southampton', 'Basingstoke', 'Andover', 'Petersfield', 'Liphook', 'New Milton', 'Lymington', 'Lee-on-the-Solent', 'Hook', 'Farnborough'],
  'somerset': ['Somerset', 'Bath', 'Taunton', 'Wellington', 'Yeovil', 'Bruton', 'Shepton Mallet', 'Radstock', 'Weston-super-Mare'],
  'kent': ['Deal', 'Dover', 'Faversham', 'Folkestone', 'Maidstone', 'Margate', 'Rochester', 'Sandwich', 'Tunbridge Wells', 'Whitstable'],
  'essex': ['Brentwood', 'Chelmsford', 'Hockley', 'Leigh-on-Sea', 'Loughton', 'Romford', 'Southend-on-Sea'],
  'lancashire': ['Preston', 'Blackpool'],
  'cumbria': ['Cumbria', 'Keswick', 'Penrith', 'Workington'],
  'derbyshire': ['Derbyshire', 'Derby', 'Chesterfield', 'Dronfield', 'Matlock'],
  'lincolnshire': ['Lincoln', 'Boston', 'Market Rasen', 'Skegness', 'Sleaford'],
  'oxfordshire': ['Oxford', 'Oxfordshire', 'Abingdon', 'Didcot', 'Thame'],
  'gloucestershire': ['Gloucestershire', 'Gloucester', 'Stroud', 'Tewkesbury', 'Lydney'],
  'buckinghamshire': ['Buckinghamshire', 'High Wycombe', 'Great Missenden'],
  'berkshire': ['Reading', 'Ascot', 'Bracknell', 'Newbury', 'Slough', 'Windsor', 'Wokingham'],
  'wiltshire': ['Swindon', 'Calne', 'Melksham', 'Salisbury', 'Trowbridge'],
  'surrey': ['Guildford', 'Woking', 'Farnham', 'West Byfleet'],
  'west-sussex': ['West Sussex', 'Chichester', 'Horsham', 'Crawley', 'Hassocks', 'Haywards Heath', 'Lancing', 'Littlehampton', 'Pulborough', 'Shoreham-by-Sea'],
  'suffolk': ['Bungay', 'Saxmundham', 'Woodbridge'],
  'worcestershire': ['Worcester', 'Kidderminster'],
  'staffordshire': ['Cannock', 'Rugeley', 'Stoke-on-Trent'],
  'cheshire': ['Cheshire', 'Cheadle', 'Congleton', 'Crewe', 'Tarporley'],
  'tyne-and-wear': ['Tyne and Wear', 'Newcastle upon Tyne', 'Gateshead', 'North Shields'],
  'south-yorkshire': ['South Yorkshire', 'Doncaster', 'Rotherham', 'Sheffield', 'Barnsley'],
  'bedfordshire': ['Bedford', 'Luton', 'Shefford'],
  'hertfordshire': ['St Albans', 'Bishop Stortford', 'Borehamwood', 'Potters Bar', 'Uxbridge', 'Waltham Abbey', 'West Drayton'],
  'northumberland': ['Hexham', 'Chathill'],
  'moray': ['Moray', 'Forres'],
  'stirling': ['Stirling', 'Callander'],
  'fife': ['Cupar', 'St Andrews'],
  'perth-and-kinross': ['Perth', 'Aberfeldy', 'Crieff', 'Dunkeld'],
  'argyll-and-bute': ['Argyll and Bute', 'Oban', 'Arrochar', 'Isle of Arran', 'Isle of Mull'],
  'dumfries-and-galloway': ['Dumfries', 'Kirkcudbright', 'Lockerbie'],
  'scottish-borders': ['Kelso'],
  'falkirk': ['Falkirk'],
  'west-dunbartonshire': ['Dumbarton'],
  'inverclyde': ['Inverclyde'],
  'shetland': ['Shetland', 'Lerwick'],
  'orkney': ['Orkney', 'Stromness'],
  'eilean-siar': ['Stornoway', 'Isle of Harris'],
  'angus': ['Dundee', 'Arbroath'],
  'east-lothian': ['North Berwick'],
  'midlothian': ['Edinburgh'],
  'cardiff': ['Cardiff'],
  'gwynedd': ['Gwynedd', 'Caernarfon', 'Bangor', 'Beaumaris', 'Blaenau Ffestiniog', 'Criccieth', 'Henfaes', 'Holyhead', 'Ty Croes'],
  'ceredigion': ['Ceredigion', 'Machynlleth'],
  'denbighshire': ['Denbighshire', 'Colwyn Bay', 'Llangollen'],
  'flintshire': ['Flint', 'Flintshire'],
  'pembrokeshire': ['Haverfordwest', 'Kilgetty', 'Milford Haven', 'Saundersfoot'],
  'carmarthenshire': ['Llanelli', 'Llandysul'],
  'vale-of-glamorgan': ['Vale of Glamorgan', 'Porthcawl'],
  'neath-port-talbot': ['Port Talbot'],
  'powys': ['Welshpool'],
  'wrexham': ['Wrexham'],
  'monmouthshire': ['Cwmbran'],
  'blaenau-gwent': ['Blackwood'],
  'antrim': ['Antrim', 'Ballymena', 'Carrickfergus'],
  'armagh': ['Craigavon'],
  'down': ['Newry', 'Bangor'],
  'fermanagh': ['Enniskillen'],
  'londonderry': ['Coleraine', 'Portstewart'],
  'tyrone': ['Dungannon', 'Omagh'],
  'north-ayrshire': ['North Ayrshire', 'Ardrossan'],
  'east-ayrshire': ['Strathaven'],
  'renfrewshire': ['Paisley']
}

// Helper function to create URL-safe slugs
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// Function to get the proper county slug for a sauna
function getCountySlug(sauna: any): string {
  for (const [slug, mappedCounties] of Object.entries(countyMapping)) {
    if (mappedCounties.includes(sauna.county)) {
      return slug
    }
  }
  // Fallback to simple slug creation
  return createSlug(sauna.county)
}

async function findSaunaBySlug(slug: string) {
  try {
    // Check if Supabase is available
    if (!supabase) {
      return null
    }

    // Get all saunas
    const { data: allSaunas, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('facility_type', 'sauna')

    if (error || !allSaunas) {
      return null
    }

    // Find the sauna that matches the old slug format
    const sauna = allSaunas.find(s => {
      const baseSlug = createSlug(s.name)
      const uniqueSlug = allSaunas.filter(other =>
        other.id !== s.id && createSlug(other.name) === baseSlug
      ).length > 0 ? createSlug(s.name + ' ' + s.city) : baseSlug

      return uniqueSlug === slug
    })

    return sauna
  } catch (error) {
    console.error('Error finding sauna:', error)
    return null
  }
}

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  const sauna = await findSaunaBySlug(params.slug)

  if (sauna) {
    const countySlug = getCountySlug(sauna)
    const citySlug = createSlug(sauna.city)
    const saunaSlug = createSlug(sauna.name)

    // Redirect to new URL structure
    redirect(`/saunas/${countySlug}/${citySlug}/${saunaSlug}`)
  } else {
    // If sauna not found, redirect to saunas page
    redirect('/saunas')
  }
}