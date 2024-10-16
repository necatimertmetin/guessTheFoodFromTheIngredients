import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper,
  Divider,
  Autocomplete,
} from "@mui/material";
import { ref, onValue } from "firebase/database"; // Import Firebase database functions
import { useState, useEffect } from "react"; // Import React hooks
import { db } from "./firebase"; // Import your Firebase configuration

function App() {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [foodNames, setFoodNames] = useState([]);
  const [sortedOptions, setSortedOptions] = useState([]); // Add sortedOptions state
  const [visibleHints, setVisibleHints] = useState({});
  const [foodImages, setFoodImages] = useState({}); // State to hold food images

  const toggleHint = (index) => {
    setVisibleHints((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific hint
    }));
  };

  const fetchAllDatas = () => {
    setVisibleHints({});
    const foodNamesRef = ref(db, "foodNames/");
    onValue(foodNamesRef, (snapshot) => {
      const data = snapshot.val();
      const foodList = Object.values(data); // Convert JSON object to array
      setFoodNames(foodList);
    });

    const recipesRef = ref(db, "recipes/");
    onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      const recipeList = Object.values(data); // Convert JSON object to array
      setCurrentRecipe(
        recipeList[Math.floor(Math.random() * recipeList.length)]
      ); // Select a random recipe
    });
  };
  const fetchImages = () => {
    const imagesRef = ref(db, "imgs/"); // Reference to the images path in your database

    onValue(imagesRef, (snapshot) => {
      const data = snapshot.val(); // Get the snapshot value
      if (data) {
        // Store food images in the state
        const foodImagesObject = Object.entries(data).reduce(
          (acc, [key, value]) => {
            acc[key] = value; // Map the food name to its URL
            return acc;
          },
          {}
        );
        console.log(foodImagesObject[0]);
        setFoodImages(foodImagesObject[0]); // Set state with the food images
      } else {
        console.log("No data available."); // Handle the case where there is no data
      }
    });
  };
  const getIngredientUrl = (ingredient) => {
    return foodImages[ingredient] || "URL bulunamadı";
  };

  useEffect(() => {
    fetchAllDatas();
    fetchImages();
  }, []);

  const handleGuess = () => {
    console.log(currentRecipe.foodName, " ", guess);
    if (currentRecipe.foodName.toLowerCase() === guess.toLowerCase()) {
      setMessage("Correct!");
      fetchAllDatas();
      setGuess("");
    } else {
      setMessage("Wrong!");
      setGuess("");
    }
  };

  useEffect(() => {
    if (guess !== "") {
      const filteredOptions = foodNames
        .filter((food) => food.toLowerCase().includes(guess.toLowerCase()))
        .sort((a, b) => {
          const aIndex = a.toLowerCase().indexOf(guess.toLowerCase());
          const bIndex = b.toLowerCase().indexOf(guess.toLowerCase());
          return aIndex - bIndex; // Sort by the position of guess
        });

      setSortedOptions(filteredOptions);
    } else {
      setSortedOptions([]); // Reset when guess is empty
    }
  }, [guess, foodNames]);

  return (
    <Container
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: "#FFD700" }}>
        Guess the Food
      </Typography>

      {currentRecipe && (
        <Paper
          elevation={4}
          style={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#3E3E3E",
          }}
        >
          <Typography variant="h6" style={{ color: "#FFD700" }}>
            Hints:
          </Typography>
          <List
            style={{ padding: "0", display: "flex", justifyContent: "center" }}
          >
            {currentRecipe.hints.map((hint, index) => (
              <ListItem
                key={index}
                button
                onClick={() => toggleHint(index)}
                style={{
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                  margin: "5px",
                }}
              >
                <ListItemText
                  primary={hint}
                  style={{
                    display: visibleHints[index] ? "block" : "none",
                    cursor: "pointer",
                    color: "#FFFFFF", // Text color for hints
                  }}
                />
                <ListItemText
                  primary={!visibleHints[index] ? "Show Hint" : ""}
                  style={{
                    display: !visibleHints[index] ? "block" : "none",
                    cursor: "pointer",
                    color: "#FFD700", // Button text color
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "14px",
                    borderRadius: "8px",
                    backgroundColor: "#333", // Button background color
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider style={{ margin: "20px 0", backgroundColor: "#FFD700" }} />
          <Typography variant="h6" style={{ color: "#FFD700" }}>
            Ingredients:
          </Typography>
          <List
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Create responsive columns with a minimum width of 150px
              gap: "10px", // Space between items
              justifyContent: "center",
              padding: 0, // Remove padding
            }}
          >
            {currentRecipe.ingredients.map((ingredient, index) => (
              <ListItem
                key={index}
                sx={{
                  textAlign: "center",
                  background: "linear-gradient(135deg, #4E4E4E, #3A3A3A)", // Gradient background
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "12px", // Slightly increased border radius
                  padding: "12px", // Increased padding for better spacing
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center align items
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow effect
                  transition: "transform 0.2s, box-shadow 0.2s", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.02)", // Scale up on hover
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Increased shadow on hover
                  },
                }}
              >
                <img
                  src={getIngredientUrl(ingredient)}
                  style={{
                    borderRadius: "8px",
                    maxWidth: "80%", // Adjust width for better fitting
                    height: "auto",
                    marginBottom: "8px", // Space between image and text
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Shadow for the image
                  }}
                />
                <ListItemText
                  primary={ingredient}
                  sx={{
                    fontSize: "1.2rem", // Larger font size for ingredient name
                    fontWeight: 600, // Semi-bold font weight
                    textTransform: "capitalize", // Capitalize ingredient names
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider style={{ margin: "20px 0", backgroundColor: "#FFD700" }} />

          {/* Guess input field */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Autocomplete
              options={sortedOptions}
              value={guess}
              onInputChange={(event, newInputValue) => {
                setGuess(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Guess The Food Name"
                  variant="outlined"
                  sx={{
                    marginBottom: "20px",
                    width: "300px",
                    backgroundColor: "#4E4E4E",
                    "& .MuiInputLabel-root": {
                      color: "#FFD700", // Default label color (gold)
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#FFD700", // Label color when focused (gold)
                    },
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderColor: "#FFD700", // Border color
                      },
                      "&:hover > fieldset": {
                        borderColor: "#FFD700", // Border color on hover
                      },
                      "&.Mui-focused > fieldset": {
                        borderColor: "#FFD700", // Border color when focused
                      },
                      color: "#FFFFFF", // Input text color
                    },
                  }}
                />
              )}
              getOptionLabel={(option) => option} // Ensure that we get the correct label from the option
              freeSolo // Allow free text input
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleGuess}
            type="submit"
            sx={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#FFD700", // Gold color
              color: "#333",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#FFC107", // Darker gold on hover
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.3)",
              },
              "&:active": {
                backgroundColor: "#FFA000", // Even darker gold when clicked
                boxShadow: "none",
              },
            }}
          >
            Guess
          </Button>

          <Typography
            variant="h6"
            style={{
              marginTop: "20px",
              color: message.includes("Correct") ? "green" : "red",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            {message}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default App;
