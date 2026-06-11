import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';

dotenv.config();

const recipes = [
  {
    name: 'Chicken Biryani',
    description: 'A fragrant, spiced rice dish with tender chicken',
    cuisine: 'Indian',
    difficulty: 'medium',
    cookingTime: 60,
    servings: 4,
    tags: ['rice', 'chicken', 'spicy', 'indian', 'biryani'],
    ingredients: [
      { name: 'Basmati rice', amount: '2 cups' },
      { name: 'Chicken pieces', amount: '500g' },
      { name: 'Onions', amount: '2 large, sliced' },
      { name: 'Yogurt', amount: '1 cup' },
      { name: 'Ginger-garlic paste', amount: '2 tbsp' },
      { name: 'Biryani masala', amount: '2 tbsp' },
      { name: 'Saffron', amount: 'a pinch' },
      { name: 'Warm milk', amount: '3 tbsp' },
      { name: 'Ghee', amount: '3 tbsp' },
      { name: 'Salt', amount: 'to taste' },
    ],
    steps: [
      { order: 1, instruction: 'Wash and soak basmati rice for 30 minutes, then drain.', duration: 0 },
      { order: 2, instruction: 'Marinate chicken with yogurt, ginger-garlic paste, biryani masala and salt. Let it rest for 20 minutes.', duration: 1200 },
      { order: 3, instruction: 'Heat ghee in a large pot. Fry sliced onions until golden brown and caramelized, about 10 minutes.', duration: 600 },
      { order: 4, instruction: 'Add the marinated chicken and cook on medium-high heat for 10 minutes until the chicken is half cooked.', duration: 600 },
      { order: 5, instruction: 'In a separate pot, boil water with whole spices and salt. Add rice and cook until 70% done, then drain.', duration: 480 },
      { order: 6, instruction: 'Layer the partially cooked rice over the chicken. Dissolve saffron in warm milk and drizzle over the rice.', duration: 0 },
      { order: 7, instruction: 'Cover tightly with a lid. Cook on high heat for 5 minutes, then reduce to very low heat and cook for 20 minutes.', duration: 1500 },
      { order: 8, instruction: 'Remove from heat and let rest for 5 minutes. Gently mix and serve hot.', duration: 300 },
    ],
  },
  {
    name: 'Pasta Carbonara',
    description: 'Classic Roman pasta with creamy egg and pancetta sauce',
    cuisine: 'Italian',
    difficulty: 'medium',
    cookingTime: 25,
    servings: 2,
    tags: ['pasta', 'italian', 'quick', 'egg', 'cheese'],
    ingredients: [
      { name: 'Spaghetti', amount: '200g' },
      { name: 'Pancetta or bacon', amount: '150g' },
      { name: 'Eggs', amount: '3 large' },
      { name: 'Pecorino Romano cheese', amount: '100g, grated' },
      { name: 'Black pepper', amount: '1 tsp, freshly ground' },
      { name: 'Salt', amount: 'for pasta water' },
    ],
    steps: [
      { order: 1, instruction: 'Bring a large pot of generously salted water to a boil.', duration: 0 },
      { order: 2, instruction: 'In a bowl, whisk together eggs, grated Pecorino Romano, and plenty of freshly ground black pepper.', duration: 0 },
      { order: 3, instruction: 'Cook pancetta in a large skillet over medium heat until crispy, about 5 minutes. Remove from heat.', duration: 300 },
      { order: 4, instruction: 'Cook spaghetti according to package instructions until al dente. Reserve 1 cup of pasta water before draining.', duration: 480 },
      { order: 5, instruction: 'Add hot drained pasta to the skillet with pancetta. Toss to combine.', duration: 0 },
      { order: 6, instruction: 'Remove skillet from heat. Add egg mixture and toss quickly, adding pasta water a little at a time to create a creamy sauce.', duration: 0 },
      { order: 7, instruction: 'Serve immediately with extra cheese and black pepper.', duration: 0 },
    ],
  },
  {
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk and aromatic spices',
    cuisine: 'Indian',
    difficulty: 'easy',
    cookingTime: 10,
    servings: 2,
    tags: ['tea', 'drink', 'spiced', 'indian', 'chai'],
    ingredients: [
      { name: 'Water', amount: '1.5 cups' },
      { name: 'Whole milk', amount: '1 cup' },
      { name: 'Black tea leaves', amount: '2 tsp' },
      { name: 'Sugar', amount: '2 tsp or to taste' },
      { name: 'Ginger', amount: '1 inch piece, crushed' },
      { name: 'Cardamom pods', amount: '3, crushed' },
      { name: 'Cinnamon stick', amount: '1 small' },
      { name: 'Cloves', amount: '2' },
    ],
    steps: [
      { order: 1, instruction: 'Crush ginger, cardamom, cinnamon, and cloves using a mortar and pestle.', duration: 0 },
      { order: 2, instruction: 'Bring water to a boil in a saucepan. Add crushed spices and simmer for 2 minutes.', duration: 120 },
      { order: 3, instruction: 'Add tea leaves and sugar. Boil for 1 minute.', duration: 60 },
      { order: 4, instruction: 'Pour in milk and bring to a boil. Let it simmer for 2 minutes, stirring occasionally.', duration: 120 },
      { order: 5, instruction: 'Strain the chai through a fine-mesh strainer into cups and serve hot.', duration: 0 },
    ],
  },
  {
    name: 'Classic Pancakes',
    description: 'Fluffy American-style breakfast pancakes',
    cuisine: 'American',
    difficulty: 'easy',
    cookingTime: 20,
    servings: 4,
    tags: ['breakfast', 'pancakes', 'sweet', 'quick'],
    ingredients: [
      { name: 'All-purpose flour', amount: '1.5 cups' },
      { name: 'Baking powder', amount: '2 tsp' },
      { name: 'Sugar', amount: '2 tbsp' },
      { name: 'Salt', amount: '0.5 tsp' },
      { name: 'Eggs', amount: '2 large' },
      { name: 'Whole milk', amount: '1.25 cups' },
      { name: 'Melted butter', amount: '3 tbsp' },
      { name: 'Vanilla extract', amount: '1 tsp' },
    ],
    steps: [
      { order: 1, instruction: 'In a large bowl, whisk together flour, baking powder, sugar, and salt.', duration: 0 },
      { order: 2, instruction: 'In a separate bowl, beat eggs, then mix in milk, melted butter, and vanilla extract.', duration: 0 },
      { order: 3, instruction: 'Pour the wet ingredients into the dry ingredients. Stir gently until just combined — small lumps are fine. Do not overmix.', duration: 0 },
      { order: 4, instruction: 'Heat a non-stick skillet or griddle over medium heat. Lightly grease with butter.', duration: 120 },
      { order: 5, instruction: 'Pour about a quarter cup of batter per pancake. Cook until bubbles form on the surface and edges look set, about 2 minutes.', duration: 120 },
      { order: 6, instruction: 'Flip and cook for another 1-2 minutes until golden brown.', duration: 120 },
      { order: 7, instruction: 'Serve immediately with maple syrup, fresh fruit, or toppings of your choice.', duration: 0 },
    ],
  },
  {
    name: 'Dal Tadka',
    description: 'Comforting lentil soup with a tempered spice garnish',
    cuisine: 'Indian',
    difficulty: 'easy',
    cookingTime: 35,
    servings: 4,
    tags: ['lentils', 'vegetarian', 'indian', 'dal', 'comfort'],
    ingredients: [
      { name: 'Yellow split lentils (moong dal)', amount: '1 cup' },
      { name: 'Water', amount: '3 cups' },
      { name: 'Tomato', amount: '1 large, chopped' },
      { name: 'Onion', amount: '1 medium, finely chopped' },
      { name: 'Ginger-garlic paste', amount: '1 tbsp' },
      { name: 'Turmeric powder', amount: '0.5 tsp' },
      { name: 'Cumin seeds', amount: '1 tsp' },
      { name: 'Red chili powder', amount: '0.5 tsp' },
      { name: 'Ghee or oil', amount: '2 tbsp' },
      { name: 'Salt', amount: 'to taste' },
    ],
    steps: [
      { order: 1, instruction: 'Wash lentils thoroughly. In a pressure cooker or pot, add lentils, water, tomato, turmeric, and salt.', duration: 0 },
      { order: 2, instruction: 'Cook in pressure cooker for 3 whistles, or in a regular pot for 20 minutes until lentils are very soft.', duration: 1200 },
      { order: 3, instruction: 'Mash the cooked lentils slightly and adjust consistency with water if needed.', duration: 0 },
      { order: 4, instruction: 'In a small pan, heat ghee over medium-high heat. Add cumin seeds and let them splutter for 30 seconds.', duration: 30 },
      { order: 5, instruction: 'Add chopped onion and fry until golden, about 5 minutes. Add ginger-garlic paste and cook 1 minute.', duration: 360 },
      { order: 6, instruction: 'Add red chili powder and stir for 30 seconds. Pour this tadka over the cooked dal.', duration: 30 },
      { order: 7, instruction: 'Stir, taste, adjust salt, and serve hot with rice or roti.', duration: 0 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing recipes');

    const inserted = await Recipe.insertMany(recipes);
    console.log(`🌱 Seeded ${inserted.length} recipes:`);
    inserted.forEach((r) => console.log(`   • ${r.name}`));

    await mongoose.disconnect();
    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
