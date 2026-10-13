import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  StyleSheet, SafeAreaView, FlatList, BackHandler, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ORANGE = '#FF6B35';
const CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan',
  'Seafood', 'Pasta', 'Salad', 'Snacks', 'Drinks',
];

const mk = (id, category, emoji, name, time, servings, calories, difficulty, ingredients, instructions) => ({
  id, category, emoji, name, time, servings, calories, difficulty, ingredients, instructions,
});

const RECIPES = [
  mk('r1', 'Breakfast', '🥞', 'Fluffy Pancakes', '20 min', 4, 350, 'Easy',
    ['1 1/2 cups flour', '1 tbsp sugar', '1 cup milk', '1 egg', '2 tbsp melted butter', '2 tsp baking powder'],
    ['Mix dry ingredients.', 'Whisk milk, egg and butter, then combine with dry mix.', 'Pour batter on a hot greased pan.', 'Flip when bubbles form and cook until golden.']),
  mk('r2', 'Breakfast', '🍳', 'Veggie Omelette', '10 min', 1, 280, 'Easy',
    ['3 eggs', '1/4 cup chopped bell pepper', '2 tbsp onion', 'Salt & pepper', '1 tbsp oil'],
    ['Whisk eggs with salt and pepper.', 'Saute vegetables for 2 minutes.', 'Pour eggs over veggies.', 'Fold and serve when set.']),
  mk('r3', 'Lunch', '🌯', 'Chicken Wrap', '25 min', 2, 480, 'Easy',
    ['2 tortillas', '200g cooked chicken', 'Lettuce', 'Tomato', '2 tbsp yogurt sauce'],
    ['Slice chicken and veggies.', 'Spread sauce on tortilla.', 'Add fillings and roll tightly.', 'Toast lightly in a pan.']),
  mk('r4', 'Lunch', '🍛', 'Chickpea Curry', '35 min', 4, 420, 'Medium',
    ['2 cans chickpeas', '1 onion', '2 tomatoes', '2 tsp curry powder', '1 cup coconut milk'],
    ['Saute onion until soft.', 'Add curry powder and tomatoes.', 'Add chickpeas and coconut milk.', 'Simmer 20 minutes and serve with rice.']),
  mk('r5', 'Dinner', '🍗', 'Roast Chicken', '1 hr 30 min', 4, 520, 'Medium',
    ['1 whole chicken', '3 tbsp butter', '4 garlic cloves', '1 lemon', 'Rosemary, salt, pepper'],
    ['Preheat oven to 200°C.', 'Rub chicken with butter, garlic and herbs.', 'Stuff with lemon.', 'Roast 75 minutes until juices run clear.']),
  mk('r6', 'Dinner', '🥩', 'Garlic Steak', '25 min', 2, 600, 'Hard',
    ['2 steaks', '3 tbsp butter', '4 garlic cloves', 'Thyme', 'Salt & pepper'],
    ['Season steaks and sear in a hot pan 3 min per side.', 'Add butter, garlic and thyme.', 'Baste for 1 minute.', 'Rest 5 minutes before slicing.']),
  mk('r7', 'Dessert', '🍫', 'Chocolate Brownies', '45 min', 9, 310, 'Medium',
    ['200g dark chocolate', '1/2 cup butter', '3/4 cup sugar', '2 eggs', '1/2 cup flour'],
    ['Melt chocolate and butter.', 'Stir in sugar and eggs.', 'Fold in flour.', 'Bake at 175°C for 25 minutes.']),
  mk('r8', 'Dessert', '🍰', 'Strawberry Cheesecake', '4 hr', 8, 390, 'Hard',
    ['200g biscuits', '100g butter', '500g cream cheese', '1/2 cup sugar', '1 cup strawberries'],
    ['Crush biscuits and mix with butter for the base.', 'Beat cream cheese with sugar.', 'Spread over base and chill 4 hours.', 'Top with strawberries.']),
  mk('r9', 'Vegan', '🥑', 'Avocado Toast', '8 min', 1, 260, 'Easy',
    ['2 slices bread', '1 avocado', 'Lemon juice', 'Chili flakes', 'Salt'],
    ['Toast the bread.', 'Mash avocado with lemon and salt.', 'Spread on toast.', 'Sprinkle chili flakes.']),
  mk('r10', 'Vegan', '🍲', 'Lentil Soup', '40 min', 4, 300, 'Easy',
    ['1 cup red lentils', '1 carrot', '1 onion', '4 cups vegetable stock', '1 tsp cumin'],
    ['Saute onion and carrot.', 'Add lentils, stock and cumin.', 'Simmer 25 minutes.', 'Blend partially and serve.']),
  mk('r11', 'Seafood', '🍤', 'Garlic Shrimp', '15 min', 2, 290, 'Easy',
    ['300g shrimp', '4 garlic cloves', '2 tbsp butter', 'Parsley', 'Lemon'],
    ['Melt butter and saute garlic.', 'Add shrimp, cook 2 minutes per side.', 'Squeeze lemon over.', 'Garnish with parsley.']),
  mk('r12', 'Seafood', '🐟', 'Baked Salmon', '25 min', 2, 410, 'Medium',
    ['2 salmon fillets', '1 tbsp olive oil', '1 lemon', 'Dill', 'Salt & pepper'],
    ['Preheat oven to 190°C.', 'Season salmon with oil, salt, pepper.', 'Top with lemon slices and dill.', 'Bake 15 minutes.']),
  mk('r13', 'Pasta', '🍝', 'Spaghetti Carbonara', '25 min', 3, 560, 'Medium',
    ['250g spaghetti', '100g pancetta', '2 eggs + 1 yolk', '1/2 cup parmesan', 'Black pepper'],
    ['Boil spaghetti.', 'Crisp pancetta.', 'Mix eggs and parmesan.', 'Toss hot pasta with pancetta, then egg mix off the heat.']),
  mk('r14', 'Pasta', '🧀', 'Mac and Cheese', '30 min', 4, 540, 'Easy',
    ['250g macaroni', '2 cups cheddar', '2 cups milk', '2 tbsp butter', '2 tbsp flour'],
    ['Boil macaroni.', 'Make roux with butter and flour.', 'Whisk in milk, then cheese.', 'Mix with pasta and serve.']),
  mk('r15', 'Salad', '🥗', 'Greek Salad', '10 min', 2, 220, 'Easy',
    ['2 tomatoes', '1 cucumber', '1/2 red onion', '100g feta', 'Olives & olive oil'],
    ['Chop vegetables.', 'Add olives and feta.', 'Drizzle with olive oil and oregano.', 'Toss and serve.']),
  mk('r16', 'Salad', '🥬', 'Caesar Salad', '15 min', 2, 340, 'Easy',
    ['1 romaine lettuce', 'Croutons', '1/4 cup parmesan', 'Caesar dressing', 'Grilled chicken (optional)'],
    ['Tear lettuce into a bowl.', 'Add dressing and toss.', 'Top with croutons and parmesan.']),
  mk('r17', 'Snacks', '🍿', 'Spiced Popcorn', '10 min', 3, 150, 'Easy',
    ['1/2 cup popcorn kernels', '2 tbsp oil', '1 tsp paprika', 'Salt'],
    ['Heat oil with kernels in a covered pot.', 'Shake until popping slows.', 'Season with paprika and salt.']),
  mk('r18', 'Snacks', '🍟', 'Crispy Fries', '40 min', 3, 320, 'Easy',
    ['4 potatoes', '2 tbsp oil', 'Salt', 'Paprika'],
    ['Cut potatoes into sticks.', 'Toss with oil and spices.', 'Bake at 220°C for 30 minutes, turning once.']),
  mk('r19', 'Drinks', '🥭', 'Mango Smoothie', '5 min', 2, 180, 'Easy',
    ['2 ripe mangoes', '1 cup yogurt', '1/2 cup milk', 'Ice cubes', 'Honey'],
    ['Peel and chop mangoes.', 'Blend all ingredients until smooth.', 'Serve cold.']),
  mk('r20', 'Drinks', '🍋', 'Fresh Lemonade', '10 min', 4, 110, 'Easy',
    ['4 lemons', '1/2 cup sugar', '4 cups water', 'Ice', 'Mint'],
    ['Juice the lemons.', 'Dissolve sugar in water.', 'Combine, add ice and mint.']),
];

export default function App() {
  const [stack, setStack] = useState([{ name: 'home' }]);
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);

  const current = stack[stack.length - 1];
  const push = (screen) => setStack((s) => [...s, screen]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { pop(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack]);

  const toggleFav = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const allRecipes = [...RECIPES, ...myRecipes];
  const getRecipe = (id) => allRecipes.find((r) => r.id === id);

  const saveRecipe = (recipe) => {
    setMyRecipes((list) =>
      list.some((r) => r.id === recipe.id)
        ? list.map((r) => (r.id === recipe.id ? recipe : r))
        : [...list, recipe]
    );
    pop();
  };

  const deleteRecipe = (id) => {
    setMyRecipes((l) => l.filter((r) => r.id !== id));
    setFavorites((f) => f.filter((x) => x !== id));
  };

  const Header = ({ title }) => (
    <View style={s.header}>
      {stack.length > 1 ? (
        <TouchableOpacity onPress={pop} style={s.backBtn} testID="back-button">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={s.backBtn} />
      )}
      <Text style={s.headerTitle}>{title}</Text>
      <View style={s.backBtn} />
    </View>
  );

  // ---------- Recipe card ----------
  const Card = ({ item }) => (
    <TouchableOpacity style={s.card} onPress={() => push({ name: 'detail', id: item.id })}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={s.cardImg} />
      ) : (
        <View style={[s.cardImg, s.emojiBox]}><Text style={{ fontSize: 48 }}>{item.emoji || '🍽️'}</Text></View>
      )}
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={s.cardTitle}>{item.name}</Text>
        <Text style={s.cardSub}>{item.category || 'My Food'}</Text>
        {item.time ? <Text style={s.cardSub}>⏱ {item.time} · 🔥 {item.calories} kcal</Text> : null}
      </View>
      <TouchableOpacity onPress={() => toggleFav(item.id)} style={{ padding: 12 }}>
        <Ionicons
          name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={26}
          color={favorites.includes(item.id) ? '#E63946' : '#999'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // ---------- Home / Feed ----------
  const renderHome = () => {
    const tabs = [...CATEGORIES, 'My Food', 'Favorites'];
    let content;
    if (category === 'My Food') {
      content = (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
          <TouchableOpacity style={s.primaryBtn} onPress={() => push({ name: 'form' })}>
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text style={s.primaryBtnText}>  Add New Recipe</Text>
          </TouchableOpacity>
          <Text style={s.sectionTitle}>My Recipes</Text>
          {myRecipes.length === 0 && <Text style={s.empty}>No recipes yet. Tap "Add New Recipe" to create one!</Text>}
          {myRecipes.map((r) => (
            <View key={r.id}>
              <Card item={r} />
              <View style={s.rowBtns}>
                <TouchableOpacity style={[s.smallBtn, { backgroundColor: '#2A9D8F' }]} onPress={() => push({ name: 'form', id: r.id })}>
                  <Text style={s.smallBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.smallBtn, { backgroundColor: '#E63946' }]} onPress={() => deleteRecipe(r.id)}>
                  <Text style={s.smallBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      let list;
      if (category === 'Favorites') list = allRecipes.filter((r) => favorites.includes(r.id));
      else if (category === 'All') list = RECIPES;
      else list = RECIPES.filter((r) => r.category === category);
      content = (
        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => <Card item={item} />}
          ListEmptyComponent={<Text style={s.empty}>{category === 'Favorites' ? 'No favorites yet. Tap the heart on a recipe!' : 'No recipes found.'}</Text>}
        />
      );
    }
    return (
      <>
        <Header title="🍴 Foodie" />
        <View style={{ height: 56 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8, alignItems: 'center' }}>
            {tabs.map((c) => (
              <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipActive]}>
                <Text style={[s.chipText, category === c && { color: '#fff' }]}>
                  {c === 'Favorites' ? '❤️ ' : c === 'My Food' ? '👨‍🍳 ' : ''}{c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {content}
      </>
    );
  };

  // ---------- Detail ----------
  const renderDetail = () => {
    const r = getRecipe(current.id);
    if (!r) return <><Header title="Recipe" /><Text style={s.empty}>Recipe not found.</Text></>;
    const fav = favorites.includes(r.id);
    return (
      <>
        <Header title="Recipe" />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {r.image ? (
            <Image source={{ uri: r.image }} style={s.heroImg} />
          ) : (
            <View style={[s.heroImg, s.emojiBox]}><Text style={{ fontSize: 90 }}>{r.emoji || '🍽️'}</Text></View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text style={[s.title, { flex: 1 }]}>{r.name}</Text>
            <TouchableOpacity onPress={() => toggleFav(r.id)}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={32} color={fav ? '#E63946' : '#999'} />
            </TouchableOpacity>
          </View>
          {r.time ? (
            <View style={s.metaRow}>
              <Meta label="Prep Time" value={r.time} />
              <Meta label="Servings" value={String(r.servings)} />
              <Meta label="Calories" value={`${r.calories}`} />
              <Meta label="Difficulty" value={r.difficulty} />
            </View>
          ) : null}
          <Text style={s.sectionTitle}>Ingredients</Text>
          {r.ingredients.map((i, idx) => <Text key={idx} style={s.line}>• {i}</Text>)}
          <Text style={s.sectionTitle}>Instructions</Text>
          {r.instructions.map((i, idx) => <Text key={idx} style={s.line}>{idx + 1}. {i}</Text>)}
        </ScrollView>
      </>
    );
  };

  const Meta = ({ label, value }) => (
    <View style={s.meta}>
      <Text style={s.metaVal}>{value}</Text>
      <Text style={s.metaLabel}>{label}</Text>
    </View>
  );

  // ---------- Form ----------
  const Form = () => {
    const editing = current.id ? myRecipes.find((r) => r.id === current.id) : null;
    const [name, setName] = useState(editing ? editing.name : '');
    const [image, setImage] = useState(editing ? editing.image : null);
    const [ingredients, setIngredients] = useState(editing ? editing.ingredients.join('\n') : '');
    const [instructions, setInstructions] = useState(editing ? editing.instructions.join('\n') : '');
    const [error, setError] = useState('');

    const pickImage = async () => {
      try {
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.7,
        });
        if (!res.canceled) setImage(res.assets[0].uri);
      } catch (e) {
        setError('Could not open the image library.');
      }
    };

    const lines = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);

    const onSave = () => {
      if (!name.trim() || !lines(ingredients).length || !lines(instructions).length) {
        setError('Please fill in the name, ingredients and instructions.');
        return;
      }
      saveRecipe({
        id: editing ? editing.id : 'my' + Date.now(),
        name: name.trim(),
        image,
        ingredients: lines(ingredients),
        instructions: lines(instructions),
        emoji: '🍽️',
      });
    };

    return (
      <>
        <Header title={editing ? 'Edit Recipe' : 'Add New Recipe'} />
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>Recipe Name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Grandma's Soup" />

          <Text style={s.label}>Image</Text>
          <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
              : <><Ionicons name="image-outline" size={40} color="#999" /><Text style={{ color: '#999' }}>Tap to upload image</Text></>}
          </TouchableOpacity>

          <Text style={s.label}>Ingredients (one per line)</Text>
          <TextInput style={[s.input, { height: 120 }]} multiline value={ingredients} onChangeText={setIngredients}
            placeholder={'2 eggs\n1 cup flour'} textAlignVertical="top" />

          <Text style={s.label}>Step-by-step Instructions (one step per line)</Text>
          <TextInput style={[s.input, { height: 140 }]} multiline value={instructions} onChangeText={setInstructions}
            placeholder={'Mix ingredients\nBake for 20 minutes'} textAlignVertical="top" />

          {error ? <Text style={{ color: '#E63946', marginTop: 8 }}>{error}</Text> : null}
          <TouchableOpacity style={[s.primaryBtn, { marginTop: 16 }]} onPress={onSave}>
            <Text style={s.primaryBtnText}>Save Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={ORANGE} />
      {current.name === 'home' && renderHome()}
      {current.name === 'detail' && renderDetail()}
      {current.name === 'form' && <Form key={current.id || 'new'} />}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F3', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  backBtn: { width: 40, alignItems: 'center' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginHorizontal: 4, borderWidth: 1, borderColor: '#eee' },
  chipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  chipText: { color: '#333', fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardImg: { width: 100, height: 100 },
  emojiBox: { backgroundColor: '#FFE8DC', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cardSub: { color: '#777', marginTop: 3, fontSize: 12 },
  heroImg: { width: '100%', height: 220, borderRadius: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, justifyContent: 'space-between' },
  meta: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, alignItems: 'center' },
  metaVal: { fontSize: 18, fontWeight: 'bold', color: ORANGE },
  metaLabel: { color: '#777', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#222' },
  line: { fontSize: 15, color: '#333', marginBottom: 6, lineHeight: 22 },
  empty: { textAlign: 'center', color: '#888', marginTop: 30, paddingHorizontal: 20 },
  primaryBtn: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  rowBtns: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: -4, marginBottom: 14 },
  smallBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  smallBtnText: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginTop: 14, marginBottom: 6, color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 15 },
  imagePicker: { height: 170, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});