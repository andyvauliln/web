import exp from "constants"

export const ownership_type = [
    {
        "ind_name": "Hak Guna Bangunan",
        "name": "Right to Build",
        "description": "Right to Build (Hak Guna Bangunan) is a type of ownership certificate that grants the holder the right to build and own structures on a specific plot of land. It is typically valid for 30 years and can be extended for another 20 years and subsequently extended for an additional 30 years. This certificate is crucial for individuals and businesses looking to construct buildings, factories, or other structures on a specific plot of land."
    },
    {
        "ind_name": "Hak Pakai",
        "name": "Right to Use",
        "description": "Right to Use (Hak Pakai) is a type of ownership certificate that grants the holder the right to use and benefit from a property owned by someone else. It is often issued for residential purposes on government-owned land and is typically valid for 25 years with extension options. This certificate is essential for individuals who want to use a property for residential purposes without owning the land itself."
    },
    {
        "ind_name": "Hak Guna Usaha",
        "name": "Right to Exploit",
        "description": "Right to Exploit (Hak Guna Usaha) is a type of ownership certificate that grants the holder the right to exploit and utilize a property for agricultural purposes, such as plantations or farming. It is typically valid for 35 years with extension options. This certificate is crucial for farmers and agricultural businesses looking to utilize land for farming or other agricultural activities."
    },
    {
        "ind_name": "Hak Pengelolaan",
        "name": "Right of Management",
        "description": "Right of Management (Hak Pengelolaan) is a type of ownership certificate that allows the holder to manage state-owned property for specific purposes. This certificate is not explicitly mentioned in the provided search results, but it is mentioned in other sources as a type of ownership that provides the right to manage state-owned property for specific purposes."
    },
    {
        "ind_name": "Hak Sewa Bangunan",
        "name": "Right to Lease",
        "description": "Right to Lease (Hak Sewa Bangunan) is a type of ownership certificate that provides the right to use a property for a specified period of time, with extension options. This type of ownership certificate is not explicitly mentioned in the provided search results, but it is mentioned in other sources as a type of ownership that grants the right to lease a property for a specific period"
    }
]

export const land_zone = [
    {
        "value": "yellow_zone",
        'color': 'text-yellow-400',
        "title": "Yellow Zone",
        "description": "In the Yellow Zone, residential and commercial buildings are allowed. This zone typically permits low to medium-rise buildings and has restrictions on industrial activities."
    },
    {
        "value": "green_zone",
        'color': 'text-green-400',
        "title": "Green Zone",
        "description": "The Green Zone is designated for agricultural use. It is suitable for farming, plantations, and agricultural activities. Building structures may be limited or restricted."
    },
    {
        "value": "red_zone",
        'color': 'text-red-400',
        "title": "Red Zone",
        "description": "The Red Zone is typically reserved for industrial activities. It allows for the construction of factories, warehouses, and other industrial facilities. Residential and commercial buildings may be restricted."
    },
    {
        "value": "pink_zone",
        "title": "Pink Zone",
        'color': 'text-pink-400',
        "description": "The Pink Zone is often designated for recreational and tourism purposes. It allows for the construction of resorts, hotels, amusement parks, and other tourism-related facilities."
    },
    {
        "value": "orange_zone",
        'color': 'text-orange-400',
        "title": "Orange Zone",
        "description": "The Orange Zone is usually designated for mixed-use development. It permits a combination of residential, commercial, and recreational activities. Building regulations may vary."
    },
    {
        "value": "special_zone",
        'color': 'text-purple-400',
        "title": "Special Economic Zone",
        "description": "Special Economic Zones are established to attract investment and promote economic growth. They typically offer incentives and tax breaks to businesses. Development in these zones may be subject to specific regulations and requirements."
    }
]

export const region = [
    {
        "name": "Denpasar"
    },
    {
        "name": "Badung"
    },
    {
        "name": "Gianyar"
    },
    {
        "name": "Tabanan"
    },
    {
        "name": "Bangli"
    },
    {
        "name": "Karangasem"
    },
    {
        "name": "Buleleng"
    },
    {
        "name": "Jembrana"
    },
    {
        "name": "Klungkung"
    }
]


export function getOwnershipType() {
    return ownership_type[Math.floor(Math.random() * ownership_type.length)]
}

export function getLandZone() {
    return land_zone[Math.floor(Math.random() * land_zone.length)]
}
export function getRandomNumber() {
    return `${Math.floor(Math.random() * 1000)}`
}
export function getRegion() {
    return region[Math.floor(Math.random() * region.length)]
}

export function getIsDetails() {
    return Math.random() > 0.5
}
export function getIsOwner() {
    return Math.random() > 0.5
}

export function getMaxRentYear() {

    return Math.random() > 0.5 ? Math.floor(Math.random() * 91) + 10 : null
}
export function getMinRentYear() {
    return Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null
}
export function getRandomBool() {
    return Math.random() > 0.5
}
export function getRandomPriceCategory() {
    const categories = ['high', 'low', 'medium'];
    return categories[Math.floor(Math.random() * categories.length)];
}
export function getRandomDocuments() {
    const doucuements = [{
        "name": "Sertificate",
        "link": "/documents/1.pdf"
    }]
    return Math.random() > 0.5 ? doucuements[Math.floor(Math.random() * doucuements.length)] : null
}
export function getRandomPictures() {
    const pictures = [
        { url: "/land-pictures/1.jpeg", is_main: true },
        { url: "/land-pictures/2.jpeg", is_main: false },
        { url: "/land-pictures/3.jpeg", is_main: false },
        { url: "/land-pictures/4.jpeg", is_main: true },
        { url: "/land-pictures/5.jpeg", is_main: false },
        { url: "/land-pictures/6.jpeg", is_main: true },
        { url: "/land-pictures/7.jpeg", is_main: false },
        { url: "/land-pictures/8.jpeg", is_main: true },
        { url: "/land-pictures/9.jpeg", is_main: false },
        { url: "/land-pictures/10.jpeg", is_main: true },
    ]
    return Math.random() > 0.5 ? [pictures[Math.floor(Math.random() * pictures.length)], pictures[Math.floor(Math.random() * pictures.length)], pictures[Math.floor(Math.random() * pictures.length)]] : null
}

export function getRandomVideo() {
    const videoes = [
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
        "/videoes/land_sideman.gif",
    ]
    return Math.random() > 0.5 ? [videoes[Math.floor(Math.random() * videoes.length)]] : null
}

export function getRandomAttraction() {
    const attractions = [
        { name: "Mt. Bromo", distance: "5 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "Mt. Bromo is a volcano located in Indonesia, specifically in the island of Bali. It is known for its dramatic terrain and the view of the ocean from the top of the mountain." },
        { name: "Ubud", distance: "3 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "Ubud is a city in Indonesia, known for its natural beauty and historical sites. It is located in the island of Bali, Indonesia, at the foot of Mount Ubud, a volcano that rises 1,600 meters above sea level. The city is home to a number of temples and historical sites, including the Ubud Temple and the Ubud Palace." },
        { name: "Waterfall", distance: "1 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "Waterfall is a natural phenomenon that occurs when water flows from a high, steep mountain or rock face to a lower area, usually below the surface. It is a common feature of the natural environment, found in various places, including forests, mountains, and coastlines." },
        { name: "Temple", distance: "2 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "A temple is a building where religious or spiritual beliefs are venerated. It is a place of worship, where people attend to religious ceremonies and practices. The architecture and decoration of temples vary, but they are typically located in religious communities and have a historical or cultural significance." },
        { name: "Museum", distance: "2 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "A museum is a collection of objects and artifacts that are displayed in a room or building for the public to enjoy. They can be found in various places, including museums in the city, national parks, and historical sites. The objects and artifacts are often related to the history, culture, or traditions of a particular area." },
        { name: "River", distance: "1 km", google_map_link: "https://www.google.com", picture: "https://www.google.com", description: "A river is a natural flow of water that runs from high altitude to low altitude, usually from a lake or ocean. They are found in various places, including forests, mountains, and coastlines. The flow of the river is usually slow and steady, but can be fast in some places." },
    ]
    return attractions[Math.floor(Math.random() * attractions.length), Math.floor(Math.random() * attractions.length), Math.floor(Math.random() * attractions.length)]
}
function getRandomNumberSmall() {
    return Math.floor(Math.random() * 10)
}

export function getRandomDistanceToTheCities() {
    const attractions = [
        { name: "Ubud", distance: `${getRandomNumberSmall()} km` },
        { name: "Canggu", distance: `${getRandomNumberSmall()} km` },
        { name: "Uluwatu", distance: `${getRandomNumberSmall()} km` },
        { name: "Tabananan", distance: `${getRandomNumberSmall()} km` },
        { name: "Amed", distance: `${getRandomNumberSmall()} km` },
        { name: "Denpasar", distance: `${getRandomNumberSmall()} km` },
        { name: "Airoport", distance: `${getRandomNumberSmall()} km` },
    ]
    return attractions[Math.floor(Math.random() * attractions.length), Math.floor(Math.random() * attractions.length), Math.floor(Math.random() * attractions.length)]
}
function getRandomDescription() {
    const desctiptions = [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    ]
    return desctiptions[Math.floor(Math.random() * desctiptions.length)]
}
function getVisitDays() {
    const visitDays = [{ weekDay: "Monday", time: "15:00" }, { weekDay: "Tuesday", time: "10:00" }, { weekDay: "Wednesday", time: "13:00" }, { weekDay: "Thursday", time: "15:00" }, { weekDay: "Friday", time: "16:00" }, { weekDay: "Saturday", time: "17:00" }, { weekDay: "Sunday", time: "11:00" }]
    const randomVisitDay = visitDays[Math.floor(Math.random() * visitDays.length)];
    return randomVisitDay ? [randomVisitDay] : '';
}

function getRandomComments() {
    const comments = [
        { id: 1, name: "Jo Branks", comment: "Can propose $350 per meter scare for this land", reply_on_message: "I can discount 10%" },
        { id: 2, name: "Tod Berek", comment: "Hi I am Interested, is it still available?", reply_on_message: null },
        { id: 3, name: "Krek Shmag", comment: "Yes", reply_on_message: "Hi I am Interested, is it still available?" },
        { id: 4, name: "Bon Djon", comment: "Is it Possible to Rent for 60 years", reply_on_message: "" },
        { id: 5, name: "Lan Kue", comment: "No, Sorry Only 30", reply_on_message: "Is it Possible to Rent for 60 years" },
        { id: 6, name: "Don Huan", comment: "Is It Rainy in this area", reply_on_message: "" },
        { id: 7, name: "Ti Liam", comment: "It's okay, only in Rain season, as everywere", reply_on_message: "Is It Rainy in this area" },
    ]
    return [comments[Math.floor(Math.random() * comments.length)], comments[Math.floor(Math.random() * comments.length)], comments[Math.floor(Math.random() * comments.length)]]
}

export function getRandomLand() {
    return {
        ownership_type: getOwnershipType(),
        land_zone: getLandZone(),
        land_size: `${getRandomNumber()}m2`,
        region: getRegion(),
        number_of_saves: getRandomNumber(),
        number_of_views: getRandomNumber(),
        description: getRandomDescription(),
        visit_dates: getVisitDays(),

        max_rent_year: getMaxRentYear(),
        min_rent_year: getMinRentYear(),
        documents: getRandomDocuments(),
        pictures: getRandomPictures(),
        nearest_attraction: getRandomAttraction(),
        distance_to_the_cities: getRandomDistanceToTheCities(),
        comments: getRandomComments(),

        price: {
            yearly_rent_price: `$${getRandomNumber()}/m2`,
            buy_price: `$${getRandomNumber()}`,
            price_category: getRandomPriceCategory(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        land_bools: {
            is_details: true,// getRandomBool(),
            is_negotibale: getRandomBool(),
            is_possible_to_buy_part: getRandomBool(),
            is_user_owner: false && getRandomBool(),
            is_for_buy: getRandomBool(),
            is_for_rent: getRandomBool(),
            is_promoted: getRandomBool(),
            is_top_rated: getRandomBool(),
            is_new: getRandomBool(),
            is_sold: getRandomBool(),
            is_available: true,
            is_from_agent: getRandomBool(),
            is_has_photo: getRandomBool(),
            is_has_video: getRandomBool(),
            is_has_sertificate: getRandomBool(),
            is_has_due_deligence: getRandomBool(),
            is_has_road_access: getRandomBool(),
            is_has_water_access: getRandomBool(),
            is_has_electricity_access: getRandomBool(),
            is_has_sewage_access: getRandomBool(),
            is_near_ocean: getRandomBool(),
            is_first_line: getRandomBool(),
            is_near_mountain: getRandomBool(),
            is_near_river_or_lake: getRandomBool(),
            is_near_lake: getRandomBool(),
            is_moutain_view: getRandomBool(),
            is_ocean_view: getRandomBool(),
            is_rice_field_view: getRandomBool(),
            is_valley_view: getRandomBool(),
        },


    }
}
