'use strict';

const { Guide } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const guidesList = [
  {
    userId: 1,
    title: 'How to Care for Monsteras',
    description: 'Essential tips for nurturing healthy Monsteras at home',
    content: "<p>Monsteras, with their striking foliage, are popular houseplants known for their easy maintenance and vibrant appearance. Follow these simple care guidelines to keep your Monstera thriving.</p> <h2>1. Proper Watering</h2> <p>Ensure the soil is evenly moist but not waterlogged. Water when the top inch of soil feels dry to the touch, usually every 1-2 weeks. Adjust frequency based on humidity levels and season.</p> <h2>2. Adequate Lighting</h2> <p>Place your Monstera in bright, indirect sunlight to encourage healthy growth. Avoid direct sunlight, which can scorch the leaves. In low light conditions, growth may slow down.</p> <h2>3. Humidity Levels</h2> <p>Monsteras prefer high humidity environments. Mist the leaves regularly or place a humidifier nearby, especially during dry seasons or in air-conditioned rooms.</p> <h2>4. Proper Drainage</h2> <p>Ensure your Monstera's pot has drainage holes to prevent waterlogging. Excess moisture can lead to root rot and other fungal diseases.</p> <h2>5. Temperature and Environment</h2> <p>Maintain a warm environment with temperatures between 65-85°F (18-30°C). Protect your Monstera from drafts and sudden temperature changes.</p> <h2>6. Fertilization</h2> <p>Feed your Monstera with a balanced, water-soluble fertilizer during the growing season (spring and summer) to promote lush foliage. Follow package instructions for proper dilution and frequency.</p> <h2>7. Pruning and Maintenance</h2> <p>Regularly prune your Monstera to encourage bushy growth and remove any damaged or yellowing leaves. Use clean, sharp scissors to make clean cuts.</p> <h2>8. Potting and Repotting</h2> <p>Choose a well-draining potting mix and repot your Monstera every 1-2 years or when the roots outgrow the container. Select a pot that's slightly larger than the current one.</p>"
  },
  {
    userId: 1,
    title: 'Top 5 Pet-Friendly Plants',
    description: 'A list of pet-friendly plants, from the ultimate pet and plant lover!',
    content: "<h2>1. Spider Plant</h2> <p>The Spider Plant is safe for cats and dogs. Its lush foliage adds a touch of green to your space, and it's easy to care for, thriving in a variety of light conditions.</p> <h2>2. Boston Fern</h2> <p>Boston Ferns are non-toxic to pets and help purify the air. They enjoy high humidity, making them ideal for bathrooms or kitchens with indirect sunlight.</p> <h2>3. Areca Palm</h2> <p>The Areca Palm is safe for pets and adds a tropical vibe to your home. Place it in a well-lit spot and water regularly to keep it healthy and vibrant.</p> <h2>4. Calathea</h2> <p>Calatheas are pet-friendly and come in various colorful patterns. These low-light plants thrive in indirect sunlight and prefer consistently moist soil.</p>  <h2>5. Friendship Plant (Pilea)</h2> <p>The Friendship Plant is safe for pets and features unique coin-shaped leaves. It's easy to propagate and makes an excellent addition to your indoor garden.</p><p>These pet-friendly plants not only enhance your living space but also provide a safe and soothing environment for your furry companions.</p>"
  },
  {
    userId: 3,
    title: 'How to Keep Pests Away',
    description: 'Learn how to tell pests: "Pests, no pesting!"',
    content: "<h2>1. Maintain Cleanliness</h2> <p>Regularly clean your living spaces and remove food debris, crumbs, and spills. Keep trash cans sealed and dispose of garbage promptly to deter pests.</p> <h2>2. Seal Entry Points</h2> <p>Inspect your home for gaps, cracks, and openings where pests can enter. Seal any entry points with caulk or weather stripping to prevent access.</p> <h2>3. Remove Standing Water</h2> <p>Eliminate sources of standing water, such as clogged gutters, leaky faucets, or stagnant ponds, as they attract pests like mosquitoes and rodents.</p> <h2>4. Store Food Properly</h2> <p>Keep food stored in airtight containers to prevent pests from accessing it. Store pet food securely and clean up spills promptly.</p> <h2>5. Use Natural Repellents</h2> <p>Consider using natural repellents like essential oils (e.g., peppermint, lavender) or plants (e.g., marigolds, basil) to deter pests. Place them strategically around your home and garden.</p> <h2>6. Maintain Outdoor Spaces</h2> <p>Keep outdoor areas tidy by trimming vegetation, removing debris, and storing firewood away from your home. Regularly inspect plants for signs of pest infestations.</p> <h2>7. Implement Integrated Pest Management (IPM)</h2> <p>Use a combination of preventive measures, cultural practices, and environmentally friendly pest control methods to manage pest populations effectively.</p> <h2>8. Seek Professional Help</h2> <p>If pest problems persist despite your efforts, consider consulting with pest control professionals. They can assess the situation and recommend appropriate treatment options.</p>"
  },
  {
    userId: 3,
    title: 'Understanding Lighting for Plants',
    description: 'Learn about the different types of light',
    content: "<h2>1. Natural Light</h2> <p>Natural light is the preferred light source for most plants. Place your plants near windows where they can receive indirect sunlight. South-facing windows generally provide the brightest light, while north-facing windows offer softer, more diffused light.</p> <h2>2. Direct Sunlight</h2> <p>Some plants thrive in direct sunlight, but too much can cause leaf burn. Monitor your plants closely and provide shading if necessary, especially during the intense afternoon sun.</p> <h2>3. Indirect Light</h2> <p>Many indoor plants prefer indirect light, which is gentler and less likely to cause damage. This type of light can be achieved by placing plants a few feet away from windows or using sheer curtains to filter sunlight.</p> <h2>4. Artificial Light</h2> <p>Supplemental lighting, such as fluorescent, LED, or grow lights, can be used to provide consistent light levels for plants, especially in areas with limited natural light. Position lights close to plants and adjust the duration and intensity based on plant requirements.</p><h2>5. Light Duration</h2><p>Most plants require around 12-16 hours of light per day for optimal growth. Use timers to ensure consistent light cycles and prevent overexposure or underexposure to light.</p><h2>6. Light Spectrum</h2> <p>Plants utilize different parts of the light spectrum for various stages of growth. Blue light promotes vegetative growth, while red light stimulates flowering and fruiting. Choose lights with appropriate spectrums or use full-spectrum bulbs for overall plant health.</p>"
  },
  {
    userId: 4,
    title: 'Different Soil Mixes for Plants',
    description: 'Explore various soil mixes tailored to different plant needs',
    content: "<h2>1. All-Purpose Potting Mix</h2><p>An all-purpose potting mix is suitable for most houseplants and outdoor container gardens. It typically consists of a blend of peat moss, perlite, and vermiculite, providing good drainage and aeration for healthy root development.</p><h2>2. Cactus/Succulent Mix</h2><p>A cactus or succulent mix is well-draining and sandy, mimicking the arid conditions these plants thrive in. It usually contains a mix of potting soil, sand, and perlite to prevent root rot and promote water drainage.</p><h2>3. Orchid Mix</h2><p>An orchid mix is designed to provide excellent drainage and aeration for orchid roots. It typically includes chunks of bark, charcoal, and perlite, allowing air to circulate around the roots while retaining moisture.</p><h2>4. Seed Starting Mix</h2><p>A seed starting mix is lightweight and fine-textured, making it ideal for germinating seeds. It often contains a blend of peat moss, vermiculite, and perlite, providing a sterile and moisture-retentive environment for seedlings.</p><h2>5. Acidic Soil Mix</h2><p>An acidic soil mix is formulated for acid-loving plants such as azaleas, rhododendrons, and blueberries. It typically contains peat moss, pine bark, and perlite, creating a slightly acidic pH level suitable for these plants.</p><p>Choose the right soil mix based on your plant's specific needs and enjoy watching them thrive in their optimal growing conditions.</p>"
  },
  {
    userId: 1,
    title: 'Caring for Plants in Winter',
    description: 'Learn how to protect your plants during the winter months',
    content: "<h2>1. Adjust Watering</h2><p>Reduce watering frequency during winter as plants tend to require less water. Check the soil moisture regularly and water only when the top inch of soil feels dry.</p><h2>2. Monitor Temperature</h2><p>Keep an eye on indoor and outdoor temperatures, as extreme cold can damage plants. Move potted plants away from drafty windows or doors, and consider insulating outdoor plants with frost cloth or mulch.</p><h2>3. Increase Humidity</h2><p>Indoor heating systems can reduce humidity levels, which may negatively impact plants. Increase humidity around indoor plants by using a humidifier, placing trays of water near them, or misting the leaves regularly.</p> <h2>4. Provide Adequate Light</h2><p>Winter days are shorter, resulting in less natural light for plants. Move indoor plants closer to windows to maximize sunlight exposure, and consider supplementing with artificial grow lights if needed.</p><h2>5. Protect from Frost</h2> <p>Outdoor plants are vulnerable to frost damage during winter. Cover tender plants with frost blankets or bring them indoors during freezing temperatures. Mulch around the base of plants to insulate roots and retain soil warmth.</p><h2>6. Prune Carefully</h2><p>Prune dormant plants sparingly during winter to remove dead or damaged branches. Avoid heavy pruning, as it can stimulate new growth that may be susceptible to frost damage.</p><h2>7. Reduce Fertilization</h2><p>Plants typically enter a period of dormancy in winter, so they require less fertilization. Limit fertilizing to once every 4-6 weeks or follow specific plant requirements for winter feeding.</p><h2>8. Watch for Pests</h2><p>Pests may seek shelter in warm indoor environments during winter. Monitor plants closely for signs of pest infestation, such as yellowing leaves or sticky residue, and treat as necessary with insecticidal soap or horticultural oil.</p>"
  },
  {
    userId: 2,
    title: 'Different Types of Plant Pots',
    description: 'Find the perfect pot for your plants',
    content: "<ul><li><h2>Terracotta Pots</h2><p>Classic clay pots with a rustic appearance. They provide good drainage but may dry out quickly.</p></li> <li><h2>Plastic Pots</h2><p>Durable and lightweight, plastic pots are affordable and come in various sizes and colors. They retain moisture well.</p></li><li><h2>Ceramic Pots</h2><p>Elegant and decorative, ceramic pots add style to indoor spaces. They can be glazed or unglazed and may require additional drainage holes.</p></li><li><h2>Fiberglass Pots</h2><p>Modern and lightweight, fiberglass pots are weather-resistant and suitable for outdoor use. They come in a variety of shapes and finishes.</p> </li><li><h2>Wooden Pots</h2><p>Natural and eco-friendly, wooden pots provide excellent insulation for plant roots. They may require lining to prevent rot.</p></li> <li> <h2>Hanging Baskets</h2><p>Perfect for trailing plants, hanging baskets are suspended from hooks or brackets. They come in various materials, including plastic, wire, and wicker.</p> </li><li><h2>Terra Cotta Planters</h2><p>Distinctive for their red-orange color, terra cotta planters are made from baked clay. They are porous, allowing for good air circulation.</p> </li><li><h2>Self-Watering Pots</h2> <p>These pots feature a reservoir at the bottom that automatically waters the plant. They are convenient for busy gardeners or plants with specific moisture needs.</p> </li></ul>"
  },
  {
    userId: 5,
    title: 'Tips for Plant Care Organization',
    description: 'Stay on top of your plant care with ease',
    content: "<h2>1. Use a Calendar or Planner</h2><p>Designate specific days for watering, fertilizing, pruning, and other plant care tasks on your calendar or planner. Set reminders to stay on track.</p><h2>2. Create a Plant Care Schedule</h2><p>Compile a plant care schedule listing each plant, its watering frequency, fertilization needs, and any other care requirements. Refer to this schedule regularly.</p><h2>3. Utilize Plant Care Apps</h2> <p>Download plant care apps that allow you to input your plant collection and set watering reminders. Some apps even provide care tips and personalized recommendations.</p> <h2>4. Label Watering Cans or Bottles</h2> <p>Label watering cans or bottles with the names of the plants they are intended for and the frequency of watering. This prevents confusion and ensures each plant receives the right amount of water.</p> <h2>5. Group Plants by Watering Needs</h2><p>Arrange your plants into groups based on their watering requirements (e.g., low, medium, high). This makes it easier to water them according to their needs and prevents over or under-watering.</p><h2>6. Invest in Self-Watering Systems</h2><p>Consider using self-watering systems such as water globes, drip irrigation, or capillary mats. These systems can help maintain consistent moisture levels in your plant pots, reducing the need for manual watering.</p> <h2>7. Keep Notes on Plant Progress</h2> <p>Keep a journal or digital notes documenting your plant care activities, observations, and any changes in plant health. This allows you to track progress and adjust your care routine accordingly.</p> <h2>8. Stay Consistent and Observant</h2><p>Consistency is key to successful plant care. Make it a habit to check your plants regularly for signs of stress, pests, or disease, and adjust your care routine as needed.</p>"
  },
  {
    userId: 5,
    title: 'How to Propagate Plants',
    description: 'Turn your plants into multiple plant babies!',
    content: "<h2>1. Stem Cutting</h2><p>Choose a healthy stem from the parent plant and cut it at a 45-degree angle just below a node. Remove lower leaves and place the cutting in water or moist soil. Keep it in a warm, bright location until roots develop.</p><h2>2. Leaf Cutting</h2><p>Select a healthy leaf from the parent plant and cut it cleanly from the stem. Place the leaf on top of moist soil or in water, ensuring the cut end makes contact with the growing medium. Roots will emerge from the cut end, eventually forming a new plant.</p><h2>3. Division</h2><p>For plants with multiple stems or offshoots (e.g., spider plants, aloe vera), carefully separate the individual sections using a clean knife or shears. Plant each division in its own pot with well-draining soil and water thoroughly.</p><h2>4. Layering</h2><p>Encourage plants with flexible stems (e.g., philodendrons, pothos) to form roots while still attached to the parent plant. Bend a stem gently to the ground and bury a portion of it in soil, keeping the tip above the surface. Roots will develop at the buried section, and once established, the new plant can be separated from the parent.</p><h2>5. Seed Propagation</h2><p>Collect seeds from mature plants and sow them in a suitable growing medium. Provide adequate moisture and warmth, and monitor seedlings as they emerge and grow. Transplant seedlings into individual pots once they develop true leaves.</p> <p>Experiment with different propagation methods to expand your plant collection and share the joy of gardening with others.</p>"
  },
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Guide.bulkCreate(guidesList, { validate: true })
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Guides';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { [Op.or]: guidesList }, {});
  }
};
