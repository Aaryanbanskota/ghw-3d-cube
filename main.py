class Pet:
    def __init__(self, name, personality):
        self.name = name
        self.personality = personality
        self.hunger = 50
        self.happiness = 50

    def feed(self):
        # Personality logic: 'Gluttons' get happier when eating
        reduction = 20 if self.personality == "Glutton" else 15
        self.hunger -= reduction
        if self.hunger < 0: self.hunger = 0
        print(f"\n{self.name} eats happily! Hunger is now {self.hunger}.")

    def play(self):
        # Personality logic: 'Playful' pets gain more happiness
        boost = 25 if self.personality == "Playful" else 15
        self.happiness += boost
        self.hunger += 10 # Playing works up an appetite!
        if self.happiness > 100: self.happiness = 100
        print(f"\n{self.name} plays with you! Happiness is now {self.happiness}.")

    def get_status(self):
        print(f"\n--- {self.name}'s Status ---")
        print(f"Mood: {self.personality}")
        print(f"Hunger: {self.hunger}/100")
        print(f"Happiness: {self.happiness}/100")

# --- Interactive Game Loop ---
print("Welcome to the Digital Pet Creator!")
name = input("What is your pet's name? ")
trait = input("Choose a personality (Playful/Glutton/Lazy): ")
my_pet = Pet(name, trait)

while True:
    my_pet.get_status()
    choice = input("\nWhat would you like to do? (1) Feed (2) Play (3) Quit: ")
    
    if choice == "1":
        my_pet.feed()
    elif choice == "2":
        my_pet.play()
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Invalid choice, try again.")