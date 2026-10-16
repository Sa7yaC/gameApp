import { randomInt } from 'node:crypto';

export const moviesDatabase = [
  // ==================== Indian — EASY ====================
  { title: "Dangal", language: "Indian", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "Sholay", language: "Indian", difficulty: "easy", year: 1975, wordCount: 1 },
  { title: "Lagaan", language: "Indian", difficulty: "easy", year: 2001, wordCount: 1 },
  { title: "3 Idiots", language: "Indian", difficulty: "easy", year: 2009, wordCount: 2 },
  { title: "PK", language: "Indian", difficulty: "easy", year: 2014, wordCount: 1 },
  { title: "Jawan", language: "Indian", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Pathaan", language: "Indian", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Chennai Express", language: "Indian", difficulty: "easy", year: 2013, wordCount: 2 },
  { title: "Dhoom", language: "Indian", difficulty: "easy", year: 2004, wordCount: 1 },
  { title: "War", language: "Indian", difficulty: "easy", year: 2019, wordCount: 1 },
  { title: "Krrish", language: "Indian", difficulty: "easy", year: 2006, wordCount: 1 },
  { title: "Don", language: "Indian", difficulty: "easy", year: 2006, wordCount: 1 },
  { title: "Ra.One", language: "Indian", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "Bajrangi Bhaijaan", language: "Indian", difficulty: "easy", year: 2015, wordCount: 2 },
  { title: "Sultan", language: "Indian", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "Dabangg", language: "Indian", difficulty: "easy", year: 2010, wordCount: 1 },
  { title: "Kick", language: "Indian", difficulty: "easy", year: 2014, wordCount: 1 },
  { title: "Queen", language: "Indian", difficulty: "easy", year: 2014, wordCount: 1 },
  { title: "Barfi!", language: "Indian", difficulty: "easy", year: 2012, wordCount: 1 },
  { title: "Kahaani", language: "Indian", difficulty: "easy", year: 2012, wordCount: 1 },
  { title: "Drishyam", language: "Indian", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "Andhadhun", language: "Indian", difficulty: "easy", year: 2018, wordCount: 1 },
  { title: "Stree", language: "Indian", difficulty: "easy", year: 2018, wordCount: 1 },
  { title: "Bhool Bhulaiyaa", language: "Indian", difficulty: "easy", year: 2007, wordCount: 2 },
  { title: "Hera Pheri", language: "Indian", difficulty: "easy", year: 2000, wordCount: 2 },
  { title: "Welcome", language: "Indian", difficulty: "easy", year: 2007, wordCount: 1 },
  { title: "Housefull", language: "Indian", difficulty: "easy", year: 2010, wordCount: 1 },
  { title: "Golmaal", language: "Indian", difficulty: "easy", year: 2006, wordCount: 1 },
  { title: "Ready", language: "Indian", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "Bodyguard", language: "Indian", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "Ghajini", language: "Indian", difficulty: "easy", year: 2008, wordCount: 1 },
  { title: "Taare Zameen Par", language: "Indian", difficulty: "easy", year: 2007, wordCount: 3 },
  { title: "Zindagi Na Milegi Dobara", language: "Indian", difficulty: "easy", year: 2011, wordCount: 4 },
  { title: "Yeh Jawaani Hai Deewani", language: "Indian", difficulty: "easy", year: 2013, wordCount: 4 },
  { title: "Kabhi Khushi Kabhie Gham", language: "Indian", difficulty: "easy", year: 2001, wordCount: 4 },
  { title: "Dilwale Dulhania Le Jayenge", language: "Indian", difficulty: "easy", year: 1995, wordCount: 4 },
  { title: "Kuch Kuch Hota Hai", language: "Indian", difficulty: "easy", year: 1998, wordCount: 4 },
  { title: "Kal Ho Naa Ho", language: "Indian", difficulty: "easy", year: 2003, wordCount: 4 },
  { title: "Om Shanti Om", language: "Indian", difficulty: "easy", year: 2007, wordCount: 3 },
  { title: "My Name Is Khan", language: "Indian", difficulty: "easy", year: 2010, wordCount: 4 },
  { title: "Jab We Met", language: "Indian", difficulty: "easy", year: 2007, wordCount: 3 },
  { title: "Rockstar", language: "Indian", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "Tamasha", language: "Indian", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "Sanju", language: "Indian", difficulty: "easy", year: 2018, wordCount: 1 },
  { title: "Animal", language: "Indian", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Gadar", language: "Indian", difficulty: "easy", year: 2001, wordCount: 1 },
  { title: "Border", language: "Indian", difficulty: "easy", year: 1997, wordCount: 1 },
  { title: "URI: The Surgical Strike", language: "Indian", difficulty: "easy", year: 2019, wordCount: 4 },
  { title: "Kesari", language: "Indian", difficulty: "easy", year: 2019, wordCount: 1 },
  { title: "Baby", language: "Indian", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "Special 26", language: "Indian", difficulty: "easy", year: 2013, wordCount: 2 },
    { title: "Baahubali", language: "Indian", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "RRR", language: "Indian", difficulty: "easy", year: 2022, wordCount: 1 },
  { title: "Pushpa", language: "Indian", difficulty: "easy", year: 2021, wordCount: 1 },
  { title: "KGF", language: "Indian", difficulty: "easy", year: 2018, wordCount: 1 },
  { title: "Kantara", language: "Indian", difficulty: "easy", year: 2022, wordCount: 1 },
  { title: "Leo", language: "Indian", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Vikram", language: "Indian", difficulty: "easy", year: 2022, wordCount: 1 },
  { title: "Magadheera", language: "Indian", difficulty: "easy", year: 2009, wordCount: 1 },
  { title: "Arjun Reddy", language: "Indian", difficulty: "easy", year: 2017, wordCount: 2 },
  { title: "Ala Vaikunthapurramuloo", language: "Indian", difficulty: "easy", year: 2020, wordCount: 1 },
  { title: "Master", language: "Indian", difficulty: "easy", year: 2021, wordCount: 1 },
  { title: "Sivaji", language: "Indian", difficulty: "easy", year: 2007, wordCount: 1 },
  { title: "Enthiran", language: "Indian", difficulty: "easy", year: 2010, wordCount: 1 },
  { title: "Minnal Murali", language: "Indian", difficulty: "easy", year: 2021, wordCount: 2 },
  { title: "Premam", language: "Indian", difficulty: "easy", year: 2015, wordCount: 1 },

  // ==================== Indian — MEDIUM ====================
  { title: "Swades", language: "Indian", difficulty: "medium", year: 2004, wordCount: 1 },
  { title: "Rang De Basanti", language: "Indian", difficulty: "medium", year: 2006, wordCount: 3 },
  { title: "Lakshya", language: "Indian", difficulty: "medium", year: 2004, wordCount: 1 },
  { title: "Dil Chahta Hai", language: "Indian", difficulty: "medium", year: 2001, wordCount: 3 },
  { title: "Wake Up Sid", language: "Indian", difficulty: "medium", year: 2009, wordCount: 3 },
  { title: "Rocket Singh: Salesman of the Year", language: "Indian", difficulty: "medium", year: 2009, wordCount: 6 },
  { title: "Band Baaja Baaraat", language: "Indian", difficulty: "medium", year: 2010, wordCount: 3 },
  { title: "Ladies vs Ricky Bahl", language: "Indian", difficulty: "medium", year: 2011, wordCount: 4 },
  { title: "Mere Brother Ki Dulhan", language: "Indian", difficulty: "medium", year: 2011, wordCount: 4 },
  { title: "Ek Tha Tiger", language: "Indian", difficulty: "medium", year: 2012, wordCount: 3 },
  { title: "Tiger Zinda Hai", language: "Indian", difficulty: "medium", year: 2017, wordCount: 3 },
  { title: "Ek Villain", language: "Indian", difficulty: "medium", year: 2014, wordCount: 2 },
  { title: "Aashiqui 2", language: "Indian", difficulty: "medium", year: 2013, wordCount: 2 },
  { title: "Murder", language: "Indian", difficulty: "medium", year: 2004, wordCount: 1 },
  { title: "Race", language: "Indian", difficulty: "medium", year: 2008, wordCount: 1 },
  { title: "Race 2", language: "Indian", difficulty: "medium", year: 2013, wordCount: 2 },
  { title: "Jolly LLB", language: "Indian", difficulty: "medium", year: 2013, wordCount: 2 },
  { title: "Jolly LLB 2", language: "Indian", difficulty: "medium", year: 2017, wordCount: 2 },
  { title: "Piku", language: "Indian", difficulty: "medium", year: 2015, wordCount: 1 },
  { title: "Pink", language: "Indian", difficulty: "medium", year: 2016, wordCount: 1 },
  { title: "Talvar", language: "Indian", difficulty: "medium", year: 2015, wordCount: 1 },
  { title: "Badla", language: "Indian", difficulty: "medium", year: 2019, wordCount: 1 },
  { title: "Ittefaq", language: "Indian", difficulty: "medium", year: 2017, wordCount: 1 },
  { title: "No One Killed Jessica", language: "Indian", difficulty: "medium", year: 2011, wordCount: 4 },
  { title: "Madras Cafe", language: "Indian", difficulty: "medium", year: 2013, wordCount: 2 },
  { title: "A Wednesday!", language: "Indian", difficulty: "medium", year: 2008, wordCount: 2 },
  { title: "Special Ops", language: "Indian", difficulty: "medium", year: 2020, wordCount: 2 },
  { title: "Raazi", language: "Indian", difficulty: "medium", year: 2018, wordCount: 1 },
  { title: "Aligarh", language: "Indian", difficulty: "medium", year: 2015, wordCount: 1 },
  { title: "Maqbool", language: "Indian", difficulty: "medium", year: 2003, wordCount: 1 },
  { title: "Omkara", language: "Indian", difficulty: "medium", year: 2006, wordCount: 1 },
  { title: "Haider", language: "Indian", difficulty: "medium", year: 2014, wordCount: 1 },
  { title: "Gully Boy", language: "Indian", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "Secret Superstar", language: "Indian", difficulty: "medium", year: 2017, wordCount: 2 },
  { title: "Hindi Medium", language: "Indian", difficulty: "medium", year: 2017, wordCount: 2 },
  { title: "Angrezi Medium", language: "Indian", difficulty: "medium", year: 2020, wordCount: 2 },
  { title: "Badhaai Ho", language: "Indian", difficulty: "medium", year: 2018, wordCount: 2 },
  { title: "Bareilly Ki Barfi", language: "Indian", difficulty: "medium", year: 2017, wordCount: 3 },
  { title: "Shubh Mangal Saavdhan", language: "Indian", difficulty: "medium", year: 2017, wordCount: 3 },
  { title: "Dum Laga Ke Haisha", language: "Indian", difficulty: "medium", year: 2015, wordCount: 4 },
  { title: "Vicky Donor", language: "Indian", difficulty: "medium", year: 2012, wordCount: 2 },
  { title: "Dream Girl", language: "Indian", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "Bala", language: "Indian", difficulty: "medium", year: 2019, wordCount: 1 },
  { title: "Luka Chuppi", language: "Indian", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "Fukrey", language: "Indian", difficulty: "medium", year: 2013, wordCount: 1 },
  { title: "Fukrey Returns", language: "Indian", difficulty: "medium", year: 2017, wordCount: 2 },
  { title: "Delhi Belly", language: "Indian", difficulty: "medium", year: 2011, wordCount: 2 },
  { title: "Go Goa Gone", language: "Indian", difficulty: "medium", year: 2013, wordCount: 3 },
  { title: "Lootera", language: "Indian", difficulty: "medium", year: 2013, wordCount: 1 },
  { title: "Lootcase", language: "Indian", difficulty: "medium", year: 2020, wordCount: 1 },
  { title: "Rangasthalam", language: "Indian", difficulty: "medium", year: 2018, wordCount: 1 },
  { title: "Jersey", language: "Indian", difficulty: "medium", year: 2019, wordCount: 1 },
  { title: "Eega", language: "Indian", difficulty: "medium", year: 2012, wordCount: 1 },
  { title: "Drishyam", language: "Indian", difficulty: "medium", year: 2013, wordCount: 1 },
  { title: "Kumbalangi Nights", language: "Indian", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "Soorarai Pottru", language: "Indian", difficulty: "medium", year: 2020, wordCount: 2 },
  { title: "Asuran", language: "Indian", difficulty: "medium", year: 2019, wordCount: 1 },
  { title: "96", language: "Indian", difficulty: "medium", year: 2018, wordCount: 1 },
  { title: "Super Deluxe", language: "Indian", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "Charlie", language: "Indian", difficulty: "medium", year: 2015, wordCount: 1 },
  { title: "Ustad Hotel", language: "Indian", difficulty: "medium", year: 2012, wordCount: 2 },
  { title: "Lucia", language: "Indian", difficulty: "medium", year: 2013, wordCount: 1 },
  { title: "777 Charlie", language: "Indian", difficulty: "medium", year: 2022, wordCount: 2 },
  { title: "Kirik Party", language: "Indian", difficulty: "medium", year: 2016, wordCount: 2 },
  { title: "Thuppakki", language: "Indian", difficulty: "medium", year: 2012, wordCount: 1 },

  // ==================== Indian — HARD ====================
  { title: "Ship of Theseus", language: "Indian", difficulty: "hard", year: 2012, wordCount: 3 },
  { title: "Manto", language: "Indian", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Court", language: "Indian", difficulty: "hard", year: 2014, wordCount: 1 },
  { title: "Ankhon Dekhi", language: "Indian", difficulty: "hard", year: 2013, wordCount: 2 },
  { title: "Masaan", language: "Indian", difficulty: "hard", year: 2015, wordCount: 1 },
  { title: "Titli", language: "Indian", difficulty: "hard", year: 2014, wordCount: 1 },
  { title: "Kadvi Hawa", language: "Indian", difficulty: "hard", year: 2017, wordCount: 2 },
  { title: "Newton", language: "Indian", difficulty: "hard", year: 2017, wordCount: 1 },
  { title: "Soni", language: "Indian", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Sir", language: "Indian", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Photograph", language: "Indian", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Eeb Allay Ooo!", language: "Indian", difficulty: "hard", year: 2019, wordCount: 3 },
  { title: "Killa", language: "Indian", difficulty: "hard", year: 2014, wordCount: 1 },
  { title: "Fandry", language: "Indian", difficulty: "hard", year: 2013, wordCount: 1 },
  { title: "Sairat", language: "Indian", difficulty: "hard", year: 2016, wordCount: 1 },
  { title: "Harishchandrachi Factory", language: "Indian", difficulty: "hard", year: 2009, wordCount: 2 },
  { title: "Valu", language: "Indian", difficulty: "hard", year: 2008, wordCount: 1 },
  { title: "Vihir", language: "Indian", difficulty: "hard", year: 2009, wordCount: 1 },
  { title: "Gabhricha Paus", language: "Indian", difficulty: "hard", year: 2009, wordCount: 2 },
  { title: "Karkhanisanchi Waari", language: "Indian", difficulty: "hard", year: 2020, wordCount: 2 },
  { title: "Astu", language: "Indian", difficulty: "hard", year: 2013, wordCount: 1 },
  { title: "Elizabeth Ekadashi", language: "Indian", difficulty: "hard", year: 2014, wordCount: 2 },
  { title: "Natarang", language: "Indian", difficulty: "hard", year: 2010, wordCount: 1 },
  { title: "Jogwa", language: "Indian", difficulty: "hard", year: 2009, wordCount: 1 },
  { title: "Deool", language: "Indian", difficulty: "hard", year: 2011, wordCount: 1 },
  { title: "Dhag", language: "Indian", difficulty: "hard", year: 2012, wordCount: 1 },
  { title: "Kaasav", language: "Indian", difficulty: "hard", year: 2016, wordCount: 1 },
  { title: "Astu: So Be It", language: "Indian", difficulty: "hard", year: 2013, wordCount: 3 },
  { title: "Anumati", language: "Indian", difficulty: "hard", year: 2013, wordCount: 1 },
  { title: "Dithee", language: "Indian", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Killa: The Fort", language: "Indian", difficulty: "hard", year: 2014, wordCount: 3 },
  { title: "Beyond the Clouds", language: "Indian", difficulty: "hard", year: 2017, wordCount: 3 },
  { title: "The Disciple", language: "Indian", difficulty: "hard", year: 2020, wordCount: 2 },
  { title: "Gamak Ghar", language: "Indian", difficulty: "hard", year: 2019, wordCount: 2 },
  { title: "Aamis", language: "Indian", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Village Rockstars", language: "Indian", difficulty: "hard", year: 2017, wordCount: 2 },
  { title: "Bulbul Can Sing", language: "Indian", difficulty: "hard", year: 2018, wordCount: 3 },
  { title: "Jahnu Barua's Halodhia Choraye Baodhan Khai", language: "Indian", difficulty: "hard", year: 1987, wordCount: 5 },
  { title: "Dikchow Banat Palaax", language: "Indian", difficulty: "hard", year: 2009, wordCount: 3 },
  { title: "Paatal Lok", language: "Indian", difficulty: "hard", year: 2020, wordCount: 2 },
  { title: "Sonchiriya", language: "Indian", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Bhonsle", language: "Indian", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Island City", language: "Indian", difficulty: "hard", year: 2015, wordCount: 2 },
  { title: "The Lunchbox", language: "Indian", difficulty: "hard", year: 2013, wordCount: 3 },
  { title: "Qissa", language: "Indian", difficulty: "hard", year: 2013, wordCount: 1 },
  { title: "Trapped", language: "Indian", difficulty: "hard", year: 2016, wordCount: 1 },
  { title: "A Death in the Gunj", language: "Indian", difficulty: "hard", year: 2016, wordCount: 5 },
  { title: "Margarita with a Straw", language: "Indian", difficulty: "hard", year: 2014, wordCount: 4 },
  { title: "Aligarh", language: "Indian", difficulty: "hard", year: 2015, wordCount: 1 },
  { title: "I Am", language: "Indian", difficulty: "hard", year: 2010, wordCount: 2 }, 
  { title: "Aaranya Kaandam", language: "Indian", difficulty: "hard", year: 2010, wordCount: 2 },
  { title: "Pariyerum Perumal", language: "Indian", difficulty: "hard", year: 2018, wordCount: 2 },
  { title: "Jigarthanda", language: "Indian", difficulty: "hard", year: 2014, wordCount: 1 },
  { title: "Aayirathil Oruvan", language: "Indian", difficulty: "hard", year: 2010, wordCount: 3 },
  { title: "Maheshinte Prathikaaram", language: "Indian", difficulty: "hard", year: 2016, wordCount: 1 },
  { title: "Angamaly Diaries", language: "Indian", difficulty: "hard", year: 2017, wordCount: 2 },
  { title: "Ee.Ma.Yau.", language: "Indian", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Vidheyan", language: "Indian", difficulty: "hard", year: 1994, wordCount: 1 },
  { title: "Ulidavaru Kandanthe", language: "Indian", difficulty: "hard", year: 2014, wordCount: 2 },
  { title: "Garuda Gamana Vrishabha Vahana", language: "Indian", difficulty: "hard", year: 2021, wordCount: 4 },
  { title: "C/o Kancharapalem", language: "Indian", difficulty: "hard", year: 2018, wordCount: 3 },
  { title: "Agent Sai Srinivasa Athreya", language: "Indian", difficulty: "hard", year: 2019, wordCount: 4 },
  { title: "Brochevarevarura", language: "Indian", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Soodhu Kavvum", language: "Indian", difficulty: "hard", year: 2013, wordCount: 2 },
  { title: "Mandela", language: "Indian", difficulty: "hard", year: 2021, wordCount: 1 },

      // ==================== HOLLYWOOD / ENGLISH — EASY ====================
  { title: "Titanic", language: "Hollywood", difficulty: "easy", year: 1997, wordCount: 1 },
  { title: "Avatar", language: "Hollywood", difficulty: "easy", year: 2009, wordCount: 1 },
  { title: "Jaws", language: "Hollywood", difficulty: "easy", year: 1975, wordCount: 1 },
  { title: "Rocky", language: "Hollywood", difficulty: "easy", year: 1976, wordCount: 1 },
  { title: "Frozen", language: "Hollywood", difficulty: "easy", year: 2013, wordCount: 1 },
  { title: "Joker", language: "Hollywood", difficulty: "easy", year: 2019, wordCount: 1 },
  { title: "Barbie", language: "Hollywood", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Oppenheimer", language: "Hollywood", difficulty: "easy", year: 2023, wordCount: 1 },
  { title: "Interstellar", language: "Hollywood", difficulty: "easy", year: 2014, wordCount: 1 },
  { title: "Inception", language: "Hollywood", difficulty: "easy", year: 2010, wordCount: 1 },
  { title: "The Matrix", language: "Hollywood", difficulty: "easy", year: 1999, wordCount: 2 },
  { title: "The Avengers", language: "Hollywood", difficulty: "easy", year: 2012, wordCount: 2 },
  { title: "Iron Man", language: "Hollywood", difficulty: "easy", year: 2008, wordCount: 2 },
  { title: "Spider-Man", language: "Hollywood", difficulty: "easy", year: 2002, wordCount: 1 },
  { title: "Batman", language: "Hollywood", difficulty: "easy", year: 1989, wordCount: 1 },
  { title: "Superman", language: "Hollywood", difficulty: "easy", year: 1978, wordCount: 1 },
  { title: "Wonder Woman", language: "Hollywood", difficulty: "easy", year: 2017, wordCount: 2 },
  { title: "Black Panther", language: "Hollywood", difficulty: "easy", year: 2018, wordCount: 2 },
  { title: "Doctor Strange", language: "Hollywood", difficulty: "easy", year: 2016, wordCount: 2 },
  { title: "Thor", language: "Hollywood", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "The Lion King", language: "Hollywood", difficulty: "easy", year: 1994, wordCount: 3 },
  { title: "Toy Story", language: "Hollywood", difficulty: "easy", year: 1995, wordCount: 2 },
  { title: "Finding Nemo", language: "Hollywood", difficulty: "easy", year: 2003, wordCount: 2 },
  { title: "Shrek", language: "Hollywood", difficulty: "easy", year: 2001, wordCount: 1 },
  { title: "Coco", language: "Hollywood", difficulty: "easy", year: 2017, wordCount: 1 },
  { title: "Up", language: "Hollywood", difficulty: "easy", year: 2009, wordCount: 1 },
  { title: "Cars", language: "Hollywood", difficulty: "easy", year: 2006, wordCount: 1 },
  { title: "Ratatouille", language: "Hollywood", difficulty: "easy", year: 2007, wordCount: 1 },
  { title: "Zootopia", language: "Hollywood", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "Minions", language: "Hollywood", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "Home Alone", language: "Hollywood", difficulty: "easy", year: 1990, wordCount: 2 },
  { title: "The Mask", language: "Hollywood", difficulty: "easy", year: 1994, wordCount: 2 },
  { title: "Jumanji", language: "Hollywood", difficulty: "easy", year: 1995, wordCount: 1 },
  { title: "Jurassic Park", language: "Hollywood", difficulty: "easy", year: 1993, wordCount: 2 },
  { title: "King Kong", language: "Hollywood", difficulty: "easy", year: 2005, wordCount: 2 },
  { title: "Godzilla", language: "Hollywood", difficulty: "easy", year: 2014, wordCount: 1 },
  { title: "The Mummy", language: "Hollywood", difficulty: "easy", year: 1999, wordCount: 2 },
  { title: "The Terminator", language: "Hollywood", difficulty: "easy", year: 1984, wordCount: 2 },
  { title: "Predator", language: "Hollywood", difficulty: "easy", year: 1987, wordCount: 1 },
  { title: "Alien", language: "Hollywood", difficulty: "easy", year: 1979, wordCount: 1 },
  { title: "Rocky Balboa", language: "Hollywood", difficulty: "easy", year: 2006, wordCount: 2 },
  { title: "Creed", language: "Hollywood", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "The Karate Kid", language: "Hollywood", difficulty: "easy", year: 1984, wordCount: 3 },
  { title: "The Hangover", language: "Hollywood", difficulty: "easy", year: 2009, wordCount: 2 },
  { title: "Mean Girls", language: "Hollywood", difficulty: "easy", year: 2004, wordCount: 2 },
  { title: "Legally Blonde", language: "Hollywood", difficulty: "easy", year: 2001, wordCount: 2 },
  { title: "The Notebook", language: "Hollywood", difficulty: "easy", year: 2004, wordCount: 2 },
  { title: "Pretty Woman", language: "Hollywood", difficulty: "easy", year: 1990, wordCount: 2 },
  { title: "La La Land", language: "Hollywood", difficulty: "easy", year: 2016, wordCount: 3 },
  { title: "The Great Gatsby", language: "Hollywood", difficulty: "easy", year: 2013, wordCount: 3 },

  // ==================== HOLLYWOOD / ENGLISH — MEDIUM ====================
  { title: "Pulp Fiction", language: "Hollywood", difficulty: "medium", year: 1994, wordCount: 2 },
  { title: "Fight Club", language: "Hollywood", difficulty: "medium", year: 1999, wordCount: 2 },
  { title: "Goodfellas", language: "Hollywood", difficulty: "medium", year: 1990, wordCount: 1 },
  { title: "The Departed", language: "Hollywood", difficulty: "medium", year: 2006, wordCount: 2 },
  { title: "The Wolf of Wall Street", language: "Hollywood", difficulty: "medium", year: 2013, wordCount: 5 },
  { title: "Shutter Island", language: "Hollywood", difficulty: "medium", year: 2010, wordCount: 2 },
  { title: "Gone Girl", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 2 },
  { title: "Prisoners", language: "Hollywood", difficulty: "medium", year: 2013, wordCount: 1 },
  { title: "Nightcrawler", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 1 },
  { title: "The Prestige", language: "Hollywood", difficulty: "medium", year: 2006, wordCount: 2 },
  { title: "Memento", language: "Hollywood", difficulty: "medium", year: 2000, wordCount: 1 },
  { title: "Tenet", language: "Hollywood", difficulty: "medium", year: 2020, wordCount: 1 },
  { title: "Dunkirk", language: "Hollywood", difficulty: "medium", year: 2017, wordCount: 1 },
  { title: "The Dark Knight", language: "Hollywood", difficulty: "medium", year: 2008, wordCount: 3 },
  { title: "Batman Begins", language: "Hollywood", difficulty: "medium", year: 2005, wordCount: 2 },
  { title: "Logan", language: "Hollywood", difficulty: "medium", year: 2017, wordCount: 1 },
  { title: "Deadpool", language: "Hollywood", difficulty: "medium", year: 2016, wordCount: 1 },
  { title: "Guardians of the Galaxy", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 4 },
  { title: "Captain America: The Winter Soldier", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 4 },
  { title: "Avengers: Infinity War", language: "Hollywood", difficulty: "medium", year: 2018, wordCount: 3 },
  { title: "Avengers: Endgame", language: "Hollywood", difficulty: "medium", year: 2019, wordCount: 2 },
  { title: "X-Men: Days of Future Past", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 5 },
  { title: "The Hunger Games", language: "Hollywood", difficulty: "medium", year: 2012, wordCount: 3 },
  { title: "Divergent", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 1 },
  { title: "The Maze Runner", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 3 },
  { title: "Ready Player One", language: "Hollywood", difficulty: "medium", year: 2018, wordCount: 3 },
  { title: "Edge of Tomorrow", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 3 },
  { title: "Minority Report", language: "Hollywood", difficulty: "medium", year: 2002, wordCount: 2 },
  { title: "War of the Worlds", language: "Hollywood", difficulty: "medium", year: 2005, wordCount: 4 },
  { title: "A Quiet Place", language: "Hollywood", difficulty: "medium", year: 2018, wordCount: 3 },
  { title: "Get Out", language: "Hollywood", difficulty: "medium", year: 2017, wordCount: 2 },
  { title: "Us", language: "Hollywood", difficulty: "medium", year: 2019, wordCount: 1 },
  { title: "The Conjuring", language: "Hollywood", difficulty: "medium", year: 2013, wordCount: 2 },
  { title: "Insidious", language: "Hollywood", difficulty: "medium", year: 2010, wordCount: 1 },
  { title: "Hereditary", language: "Hollywood", difficulty: "medium", year: 2018, wordCount: 1 },
  { title: "The Sixth Sense", language: "Hollywood", difficulty: "medium", year: 1999, wordCount: 3 },
  { title: "The Truman Show", language: "Hollywood", difficulty: "medium", year: 1998, wordCount: 3 },
  { title: "Eternal Sunshine of the Spotless Mind", language: "Hollywood", difficulty: "medium", year: 2004, wordCount: 6 },
  { title: "The Curious Case of Benjamin Button", language: "Hollywood", difficulty: "medium", year: 2008, wordCount: 6 },
  { title: "The Pursuit of Happyness", language: "Hollywood", difficulty: "medium", year: 2006, wordCount: 3 },
  { title: "Good Will Hunting", language: "Hollywood", difficulty: "medium", year: 1997, wordCount: 3 },
  { title: "Dead Poets Society", language: "Hollywood", difficulty: "medium", year: 1989, wordCount: 3 },
  { title: "The Social Network", language: "Hollywood", difficulty: "medium", year: 2010, wordCount: 3 },
  { title: "Catch Me If You Can", language: "Hollywood", difficulty: "medium", year: 2002, wordCount: 5 },
  { title: "The Imitation Game", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 3 },
  { title: "A Beautiful Mind", language: "Hollywood", difficulty: "medium", year: 2001, wordCount: 3 },
  { title: "The Grand Budapest Hotel", language: "Hollywood", difficulty: "medium", year: 2014, wordCount: 4 },
  { title: "The Devil Wears Prada", language: "Hollywood", difficulty: "medium", year: 2006, wordCount: 4 },
  { title: "The Princess Diaries", language: "Hollywood", difficulty: "medium", year: 2001, wordCount: 3 },
  { title: "The Breakfast Club", language: "Hollywood", difficulty: "medium", year: 1985, wordCount: 3 },

  // ==================== HOLLYWOOD / ENGLISH — HARD ====================
  { title: "Synecdoche, New York", language: "Hollywood", difficulty: "hard", year: 2008, wordCount: 3 },
  { title: "Mulholland Drive", language: "Hollywood", difficulty: "hard", year: 2001, wordCount: 2 },
  { title: "Blue Velvet", language: "Hollywood", difficulty: "hard", year: 1986, wordCount: 2 },
  { title: "Eraserhead", language: "Hollywood", difficulty: "hard", year: 1977, wordCount: 1 },
  { title: "The Tree of Life", language: "Hollywood", difficulty: "hard", year: 2011, wordCount: 4 },
  { title: "There Will Be Blood", language: "Hollywood", difficulty: "hard", year: 2007, wordCount: 4 },
  { title: "No Country for Old Men", language: "Hollywood", difficulty: "hard", year: 2007, wordCount: 5 },
  { title: "The Assassination of Jesse James by the Coward Robert Ford", language: "Hollywood", difficulty: "hard", year: 2007, wordCount: 10 },
  { title: "Being John Malkovich", language: "Hollywood", difficulty: "hard", year: 1999, wordCount: 3 },
  { title: "Adaptation", language: "Hollywood", difficulty: "hard", year: 2002, wordCount: 1 },
  { title: "A Clockwork Orange", language: "Hollywood", difficulty: "hard", year: 1971, wordCount: 3 },
  { title: "The Seventh Seal", language: "Hollywood", difficulty: "hard", year: 1957, wordCount: 3 },
  { title: "Rashomon", language: "Hollywood", difficulty: "hard", year: 1950, wordCount: 1 },
  { title: "12 Angry Men", language: "Hollywood", difficulty: "hard", year: 1957, wordCount: 3 },
  { title: "Citizen Kane", language: "Hollywood", difficulty: "hard", year: 1941, wordCount: 2 },
  { title: "Sunset Boulevard", language: "Hollywood", difficulty: "hard", year: 1950, wordCount: 2 },
  { title: "The Maltese Falcon", language: "Hollywood", difficulty: "hard", year: 1941, wordCount: 3 },
  { title: "Chinatown", language: "Hollywood", difficulty: "hard", year: 1974, wordCount: 1 },
  { title: "The French Connection", language: "Hollywood", difficulty: "hard", year: 1971, wordCount: 3 },
  { title: "All the President's Men", language: "Hollywood", difficulty: "hard", year: 1976, wordCount: 4 },
  { title: "The Thin Red Line", language: "Hollywood", difficulty: "hard", year: 1998, wordCount: 4 },
  { title: "Apocalypse Now", language: "Hollywood", difficulty: "hard", year: 1979, wordCount: 2 },
  { title: "Full Metal Jacket", language: "Hollywood", difficulty: "hard", year: 1987, wordCount: 3 },
  { title: "The Deer Hunter", language: "Hollywood", difficulty: "hard", year: 1978, wordCount: 3 },
  { title: "Requiem for a Dream", language: "Hollywood", difficulty: "hard", year: 2000, wordCount: 4 },
  { title: "Black Swan", language: "Hollywood", difficulty: "hard", year: 2010, wordCount: 2 },
  { title: "The Lighthouse", language: "Hollywood", difficulty: "hard", year: 2019, wordCount: 2 },
  { title: "The Witch", language: "Hollywood", difficulty: "hard", year: 2015, wordCount: 2 },
  { title: "Midsommar", language: "Hollywood", difficulty: "hard", year: 2019, wordCount: 1 },
  { title: "Under the Skin", language: "Hollywood", difficulty: "hard", year: 2013, wordCount: 3 },
  { title: "Annihilation", language: "Hollywood", difficulty: "hard", year: 2018, wordCount: 1 },
  { title: "Primer", language: "Hollywood", difficulty: "hard", year: 2004, wordCount: 1 },
  { title: "Coherence", language: "Hollywood", difficulty: "hard", year: 2013, wordCount: 1 },
  { title: "Moon", language: "Hollywood", difficulty: "hard", year: 2009, wordCount: 1 },
  { title: "Ex Machina", language: "Hollywood", difficulty: "hard", year: 2014, wordCount: 2 },
  { title: "Children of Men", language: "Hollywood", difficulty: "hard", year: 2006, wordCount: 3 },
  { title: "Brazil", language: "Hollywood", difficulty: "hard", year: 1985, wordCount: 1 },
  { title: "Dark City", language: "Hollywood", difficulty: "hard", year: 1998, wordCount: 2 },
  { title: "The Fall", language: "Hollywood", difficulty: "hard", year: 2006, wordCount: 2 },
  { title: "Cloud Atlas", language: "Hollywood", difficulty: "hard", year: 2012, wordCount: 2 },
  { title: "The Fountain", language: "Hollywood", difficulty: "hard", year: 2006, wordCount: 2 },
  { title: "A Serious Man", language: "Hollywood", difficulty: "hard", year: 2009, wordCount: 3 },
  { title: "Inside Llewyn Davis", language: "Hollywood", difficulty: "hard", year: 2013, wordCount: 3 },
  { title: "The Killing of a Sacred Deer", language: "Hollywood", difficulty: "hard", year: 2017, wordCount: 6 },
  { title: "I'm Thinking of Ending Things", language: "Hollywood", difficulty: "hard", year: 2020, wordCount: 6 },
  { title: "The Banshees of Inisherin", language: "Hollywood", difficulty: "hard", year: 2022, wordCount: 5 },
  { title: "A Ghost Story", language: "Hollywood", difficulty: "hard", year: 2017, wordCount: 3 },
  { title: "The Lobster", language: "Hollywood", difficulty: "hard", year: 2015, wordCount: 2 },
  { title: "The Man Who Wasn't There", language: "Hollywood", difficulty: "hard", year: 2001, wordCount: 5 },
  { title: "The Last Temptation of Christ", language: "Hollywood", difficulty: "hard", year: 1988, wordCount: 5 },

      // ==================== ANIMATED MOVIES — EASY ====================
  { title: "The Lion King", language: "Animated", difficulty: "easy", year: 1994, wordCount: 3 },
  { title: "Frozen", language: "Animated", difficulty: "easy", year: 2013, wordCount: 1 },
  { title: "Toy Story", language: "Animated", difficulty: "easy", year: 1995, wordCount: 2 },
  { title: "Finding Nemo", language: "Animated", difficulty: "easy", year: 2003, wordCount: 2 },
  { title: "Shrek", language: "Animated", difficulty: "easy", year: 2001, wordCount: 1 },
  { title: "Minions", language: "Animated", difficulty: "easy", year: 2015, wordCount: 1 },
  { title: "Despicable Me", language: "Animated", difficulty: "easy", year: 2010, wordCount: 2 },
  { title: "Kung Fu Panda", language: "Animated", difficulty: "easy", year: 2008, wordCount: 3 },
  { title: "Cars", language: "Animated", difficulty: "easy", year: 2006, wordCount: 1 },
  { title: "Coco", language: "Animated", difficulty: "easy", year: 2017, wordCount: 1 },
  { title: "Up", language: "Animated", difficulty: "easy", year: 2009, wordCount: 1 },
  { title: "Inside Out", language: "Animated", difficulty: "easy", year: 2015, wordCount: 2 },
  { title: "Moana", language: "Animated", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "Zootopia", language: "Animated", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "Ratatouille", language: "Animated", difficulty: "easy", year: 2007, wordCount: 1 },
  { title: "The Incredibles", language: "Animated", difficulty: "easy", year: 2004, wordCount: 2 },
  { title: "Monsters Inc.", language: "Animated", difficulty: "easy", year: 2001, wordCount: 2 },
  { title: "WALL-E", language: "Animated", difficulty: "easy", year: 2008, wordCount: 1 },
  { title: "Tangled", language: "Animated", difficulty: "easy", year: 2010, wordCount: 1 },
  { title: "Aladdin", language: "Animated", difficulty: "easy", year: 1992, wordCount: 1 },
  { title: "Mulan", language: "Animated", difficulty: "easy", year: 1998, wordCount: 1 },
  { title: "Beauty and the Beast", language: "Animated", difficulty: "easy", year: 1991, wordCount: 4 },
  { title: "Cinderella", language: "Animated", difficulty: "easy", year: 1950, wordCount: 1 },
  { title: "Sleeping Beauty", language: "Animated", difficulty: "easy", year: 1959, wordCount: 2 },
  { title: "Pinocchio", language: "Animated", difficulty: "easy", year: 1940, wordCount: 1 },
  { title: "The Little Mermaid", language: "Animated", difficulty: "easy", year: 1989, wordCount: 3 },
  { title: "Bambi", language: "Animated", difficulty: "easy", year: 1942, wordCount: 1 },
  { title: "Dumbo", language: "Animated", difficulty: "easy", year: 1941, wordCount: 1 },
  { title: "Peter Pan", language: "Animated", difficulty: "easy", year: 1953, wordCount: 2 },
  { title: "Madagascar", language: "Animated", difficulty: "easy", year: 2005, wordCount: 1 },
  { title: "Ice Age", language: "Animated", difficulty: "easy", year: 2002, wordCount: 2 },
  { title: "The Croods", language: "Animated", difficulty: "easy", year: 2013, wordCount: 2 },
  { title: "Rio", language: "Animated", difficulty: "easy", year: 2011, wordCount: 1 },
  { title: "The Boss Baby", language: "Animated", difficulty: "easy", year: 2017, wordCount: 3 },
  { title: "Hotel Transylvania", language: "Animated", difficulty: "easy", year: 2012, wordCount: 2 },
  { title: "Trolls", language: "Animated", difficulty: "easy", year: 2016, wordCount: 1 },
  { title: "The Angry Birds Movie", language: "Animated", difficulty: "easy", year: 2016, wordCount: 4 },
  { title: "Puss in Boots", language: "Animated", difficulty: "easy", year: 2011, wordCount: 3 },
  { title: "The Super Mario Bros. Movie", language: "Animated", difficulty: "easy", year: 2023, wordCount: 5 },
  { title: "Spider-Man: Into the Spider-Verse", language: "Animated", difficulty: "easy", year: 2018, wordCount: 4 },
  { title: "Spider-Man: Across the Spider-Verse", language: "Animated", difficulty: "easy", year: 2023, wordCount: 4 },
  { title: "The Lego Movie", language: "Animated", difficulty: "easy", year: 2014, wordCount: 3 },
  { title: "The Nightmare Before Christmas", language: "Animated", difficulty: "easy", year: 1993, wordCount: 4 },
  { title: "Coraline", language: "Animated", difficulty: "easy", year: 2009, wordCount: 1 },
  { title: "The Polar Express", language: "Animated", difficulty: "easy", year: 2004, wordCount: 3 },
  { title: "Klaus", language: "Animated", difficulty: "easy", year: 2019, wordCount: 1 },
  { title: "The Grinch", language: "Animated", difficulty: "easy", year: 2018, wordCount: 2 },
  { title: "The Garfield Movie", language: "Animated", difficulty: "easy", year: 2024, wordCount: 3 },
  { title: "The Wild Robot", language: "Animated", difficulty: "easy", year: 2024, wordCount: 3 },
  { title: "The Peanuts Movie", language: "Animated", difficulty: "easy", year: 2015, wordCount: 3 },

  // ==================== ANIMATED MOVIES — MEDIUM ====================
  { title: "Spirited Away", language: "Animated", difficulty: "medium", year: 2001, wordCount: 2 },
  { title: "My Neighbor Totoro", language: "Animated", difficulty: "medium", year: 1988, wordCount: 3 },
  { title: "Howl's Moving Castle", language: "Animated", difficulty: "medium", year: 2004, wordCount: 3 },
  { title: "Princess Mononoke", language: "Animated", difficulty: "medium", year: 1997, wordCount: 2 },
  { title: "Ponyo", language: "Animated", difficulty: "medium", year: 2008, wordCount: 1 },
  { title: "Kiki's Delivery Service", language: "Animated", difficulty: "medium", year: 1989, wordCount: 3 },
  { title: "The Boy and the Heron", language: "Animated", difficulty: "medium", year: 2023, wordCount: 4 },
  { title: "The Wind Rises", language: "Animated", difficulty: "medium", year: 2013, wordCount: 3 },
  { title: "Castle in the Sky", language: "Animated", difficulty: "medium", year: 1986, wordCount: 3 },
  { title: "Whisper of the Heart", language: "Animated", difficulty: "medium", year: 1995, wordCount: 4 },
  { title: "The Tale of the Princess Kaguya", language: "Animated", difficulty: "medium", year: 2013, wordCount: 6 },
  { title: "When Marnie Was There", language: "Animated", difficulty: "medium", year: 2014, wordCount: 4 },
  { title: "The Secret World of Arrietty", language: "Animated", difficulty: "medium", year: 2010, wordCount: 5 },
  { title: "Grave of the Fireflies", language: "Animated", difficulty: "medium", year: 1988, wordCount: 4 },
  { title: "The Cat Returns", language: "Animated", difficulty: "medium", year: 2002, wordCount: 3 },
  { title: "Your Name", language: "Animated", difficulty: "medium", year: 2016, wordCount: 2 },
  { title: "Weathering with You", language: "Animated", difficulty: "medium", year: 2019, wordCount: 3 },
  { title: "Suzume", language: "Animated", difficulty: "medium", year: 2022, wordCount: 1 },
  { title: "A Silent Voice", language: "Animated", difficulty: "medium", year: 2016, wordCount: 3 },
  { title: "The Girl Who Leapt Through Time", language: "Animated", difficulty: "medium", year: 2006, wordCount: 6 },
  { title: "Wolf Children", language: "Animated", difficulty: "medium", year: 2012, wordCount: 2 },
  { title: "Summer Wars", language: "Animated", difficulty: "medium", year: 2009, wordCount: 2 },
  { title: "The Garden of Words", language: "Animated", difficulty: "medium", year: 2013, wordCount: 4 },
  { title: "I Want to Eat Your Pancreas", language: "Animated", difficulty: "medium", year: 2018, wordCount: 6 },
  { title: "The Boy and the Beast", language: "Animated", difficulty: "medium", year: 2015, wordCount: 5 },
  { title: "Perfect Blue", language: "Animated", difficulty: "medium", year: 1997, wordCount: 2 },
  { title: "Paprika", language: "Animated", difficulty: "medium", year: 2006, wordCount: 1 },
  { title: "Akira", language: "Animated", difficulty: "medium", year: 1988, wordCount: 1 },
  { title: "Ghost in the Shell", language: "Animated", difficulty: "medium", year: 1995, wordCount: 4 },
  { title: "The End of Evangelion", language: "Animated", difficulty: "medium", year: 1997, wordCount: 4 },
  { title: "The First Slam Dunk", language: "Animated", difficulty: "medium", year: 2022, wordCount: 3 },
  { title: "Dragon Ball Super: Broly", language: "Animated", difficulty: "medium", year: 2018, wordCount: 3 },
  { title: "Demon Slayer: Mugen Train", language: "Animated", difficulty: "medium", year: 2020, wordCount: 3 },
  { title: "Jujutsu Kaisen 0", language: "Animated", difficulty: "medium", year: 2021, wordCount: 3 },
  { title: "One Piece Film: Red", language: "Animated", difficulty: "medium", year: 2022, wordCount: 3 },
  { title: "The SpongeBob SquarePants Movie", language: "Animated", difficulty: "medium", year: 2004, wordCount: 4 },
  { title: "The Emperor's New Groove", language: "Animated", difficulty: "medium", year: 2000, wordCount: 4 },
  { title: "Lilo & Stitch", language: "Animated", difficulty: "medium", year: 2002, wordCount: 2 },
  { title: "The Princess and the Frog", language: "Animated", difficulty: "medium", year: 2009, wordCount: 4 },
  { title: "Wreck-It Ralph", language: "Animated", difficulty: "medium", year: 2012, wordCount: 2 },
  { title: "Big Hero 6", language: "Animated", difficulty: "medium", year: 2014, wordCount: 3 },
  { title: "Raya and the Last Dragon", language: "Animated", difficulty: "medium", year: 2021, wordCount: 5 },
  { title: "Encanto", language: "Animated", difficulty: "medium", year: 2021, wordCount: 1 },
  { title: "Turning Red", language: "Animated", difficulty: "medium", year: 2022, wordCount: 2 },
  { title: "Soul", language: "Animated", difficulty: "medium", year: 2020, wordCount: 1 },
  { title: "Elemental", language: "Animated", difficulty: "medium", year: 2023, wordCount: 1 },
  { title: "Onward", language: "Animated", difficulty: "medium", year: 2020, wordCount: 1 },
  { title: "Luca", language: "Animated", difficulty: "medium", year: 2021, wordCount: 1 },
  { title: "The Mitchells vs. the Machines", language: "Animated", difficulty: "medium", year: 2021, wordCount: 5 },
  { title: "Puss in Boots: The Last Wish", language: "Animated", difficulty: "medium", year: 2022, wordCount: 5 },
  { title: "Chicken Run", language: "Animated", difficulty: "medium", year: 2000, wordCount: 2 },

  // ==================== ANIMATED MOVIES — HARD ====================
  { title: "Millennium Actress", language: "Animated", difficulty: "hard", year: 2001, wordCount: 2 },
  { title: "Tokyo Godfathers", language: "Animated", difficulty: "hard", year: 2003, wordCount: 2 },
  { title: "The Night Is Short, Walk on Girl", language: "Animated", difficulty: "hard", year: 2017, wordCount: 6 },
  { title: "In This Corner of the World", language: "Animated", difficulty: "hard", year: 2016, wordCount: 5 },
  { title: "The Place Promised in Our Early Days", language: "Animated", difficulty: "hard", year: 2004, wordCount: 6 },
  { title: "5 Centimeters per Second", language: "Animated", difficulty: "hard", year: 2007, wordCount: 4 },
  { title: "The Sky Crawlers", language: "Animated", difficulty: "hard", year: 2008, wordCount: 3 },
  { title: "Redline", language: "Animated", difficulty: "hard", year: 2009, wordCount: 1 },
  { title: "Jin-Roh: The Wolf Brigade", language: "Animated", difficulty: "hard", year: 1999, wordCount: 3 },
  { title: "Memories", language: "Animated", difficulty: "hard", year: 1995, wordCount: 1 },
  { title: "The Animatrix", language: "Animated", difficulty: "hard", year: 2003, wordCount: 1 },
  { title: "The Tale of the White Serpent", language: "Animated", difficulty: "hard", year: 1958, wordCount: 5 },
  { title: "Belladonna of Sadness", language: "Animated", difficulty: "hard", year: 1973, wordCount: 3 },
  { title: "Angel's Egg", language: "Animated", difficulty: "hard", year: 1985, wordCount: 2 },
  { title: "Night on the Galactic Railroad", language: "Animated", difficulty: "hard", year: 1985, wordCount: 5 },
  { title: "The House of Small Cubes", language: "Animated", difficulty: "hard", year: 2008, wordCount: 5 },
  { title: "The Illusionist", language: "Animated", difficulty: "hard", year: 2010, wordCount: 2 },
  { title: "The Triplets of Belleville", language: "Animated", difficulty: "hard", year: 2003, wordCount: 4 },
  { title: "Fantastic Planet", language: "Animated", difficulty: "hard", year: 1973, wordCount: 2 },
  { title: "The Secret of Kells", language: "Animated", difficulty: "hard", year: 2009, wordCount: 4 },
  { title: "Song of the Sea", language: "Animated", difficulty: "hard", year: 2014, wordCount: 3 },
  { title: "Wolfwalkers", language: "Animated", difficulty: "hard", year: 2020, wordCount: 1 },
  { title: "Persepolis", language: "Animated", difficulty: "hard", year: 2007, wordCount: 1 },
  { title: "Mary and Max", language: "Animated", difficulty: "hard", year: 2009, wordCount: 3 },
  { title: "Anomalisa", language: "Animated", difficulty: "hard", year: 2015, wordCount: 1 },
  { title: "Isle of Dogs", language: "Animated", difficulty: "hard", year: 2018, wordCount: 3 },
  { title: "Fantastic Mr. Fox", language: "Animated", difficulty: "hard", year: 2009, wordCount: 3 },
  { title: "The Adventures of Prince Achmed", language: "Animated", difficulty: "hard", year: 1926, wordCount: 4 },
  { title: "The Plague Dogs", language: "Animated", difficulty: "hard", year: 1982, wordCount: 3 },
  { title: "Watership Down", language: "Animated", difficulty: "hard", year: 1978, wordCount: 2 },
  { title: "The Last Unicorn", language: "Animated", difficulty: "hard", year: 1982, wordCount: 3 },
  { title: "The Secret of NIMH", language: "Animated", difficulty: "hard", year: 1982, wordCount: 4 },
  { title: "The Iron Giant", language: "Animated", difficulty: "hard", year: 1999, wordCount: 3 },
  { title: "The Black Cauldron", language: "Animated", difficulty: "hard", year: 1985, wordCount: 3 },
  { title: "Atlantis: The Lost Empire", language: "Animated", difficulty: "hard", year: 2001, wordCount: 4 },
  { title: "Treasure Planet", language: "Animated", difficulty: "hard", year: 2002, wordCount: 2 },
  { title: "Titan A.E.", language: "Animated", difficulty: "hard", year: 2000, wordCount: 2 },
  { title: "The Road to El Dorado", language: "Animated", difficulty: "hard", year: 2000, wordCount: 4 },
  { title: "The Prince of Egypt", language: "Animated", difficulty: "hard", year: 1998, wordCount: 4 },
  { title: "Spirit: Stallion of the Cimarron", language: "Animated", difficulty: "hard", year: 2002, wordCount: 4 },
  { title: "The Rescuers Down Under", language: "Animated", difficulty: "hard", year: 1990, wordCount: 4 },
  { title: "The Hunchback of Notre Dame", language: "Animated", difficulty: "hard", year: 1996, wordCount: 5 },
  { title: "The Fox and the Hound", language: "Animated", difficulty: "hard", year: 1981, wordCount: 4 },
  { title: "The Aristocats", language: "Animated", difficulty: "hard", year: 1970, wordCount: 2 },
  { title: "The Many Adventures of Winnie the Pooh", language: "Animated", difficulty: "hard", year: 1977, wordCount: 7 },
  { title: "The Great Mouse Detective", language: "Animated", difficulty: "hard", year: 1986, wordCount: 4 },
  { title: "The Rescuers", language: "Animated", difficulty: "hard", year: 1977, wordCount: 2 },
  { title: "The Sword in the Stone", language: "Animated", difficulty: "hard", year: 1963, wordCount: 5 },
  { title: "The Adventures of Ichabod and Mr. Toad", language: "Animated", difficulty: "hard", year: 1949, wordCount: 7 },
  { title: "The Three Caballeros", language: "Animated", difficulty: "hard", year: 1944, wordCount: 3 },
];

export function getMainTitleWordCount(title) {
    const mainTitle = String(title || '')
        .split(/\s*[:\u2013\u2014]\s*|\s+-\s+/, 1)[0]
        .trim()
        .replace(/^the\s+/i, '');

    return mainTitle ? mainTitle.split(/\s+/).filter(Boolean).length : 0;
}

/**
 * Return up to 3 distinct, unused movie options for the current settings.
 */
function shuffleMovies(movies) {
    const shuffled = [...movies];

    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = randomInt(index + 1);
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

function formatMovieChoice(movie) {
    const words = getMainTitleWordCount(movie.title);

    return {
        title: movie.title,
        name: movie.title,
        language: movie.language,
        year: movie.year,
        years: movie.year,
        wordCount: words,
        countOfWords: words
    };
}

export function getMovieChoices(difficulty = 'easy', languages = ['Indian'], usedTitles = new Set()) {
    const selectedLanguages = languages.map(language =>
        language.toLowerCase() === 'bollywood' ? 'indian' : language.toLowerCase()
    );
    if (selectedLanguages.includes('mixed')) {
        const categories = ['Indian', 'Hollywood', 'Animated'];
        const categoryPools = categories.map(category => {
            let categoryPool = moviesDatabase.filter(movie => {
                if (movie.language !== category) return false;
                if (difficulty === 'easy') return movie.difficulty === 'easy';
                if (difficulty === 'medium') return movie.difficulty === 'medium' || movie.difficulty === 'easy';
                return movie.difficulty === 'hard' || movie.difficulty === 'medium';
            });

            if (categoryPool.length === 0) {
                categoryPool = moviesDatabase.filter(movie => movie.language === category);
            }

            return categoryPool;
        });
        const unusedMovies = Array.from(new Map(
            categoryPools.flat()
                .filter(movie => !usedTitles.has(movie.title.toLowerCase()))
                .map(movie => [movie.title.toLowerCase(), movie])
        ).values());
        const availableMovies = unusedMovies.length > 0
            ? unusedMovies
            : Array.from(new Map(categoryPools.flat().map(movie => [movie.title.toLowerCase(), movie])).values());
        const availableTitles = new Set(availableMovies.map(movie => movie.title.toLowerCase()));
        const selected = [];

        for (const categoryPool of categoryPools) {
            const categoryMovies = shuffleMovies(categoryPool.filter(movie => availableTitles.has(movie.title.toLowerCase())));
            if (categoryMovies.length > 0) {
                selected.push(categoryMovies[0]);
            }
        }

        const selectedTitles = new Set(selected.map(movie => movie.title.toLowerCase()));
        const remainingMovies = shuffleMovies(availableMovies.filter(movie => !selectedTitles.has(movie.title.toLowerCase())));
        return [...selected, ...remainingMovies].slice(0, 3).map(formatMovieChoice);
    }

    let pool = [];

    if (difficulty === 'easy') {
        const lang = selectedLanguages[0] || 'indian';
        pool = moviesDatabase.filter(m => m.language.toLowerCase() === lang && m.difficulty === 'easy');
    } else if (difficulty === 'medium') {
        const selectedLangs = selectedLanguages.length > 0 ? selectedLanguages : ['indian', 'hollywood'];
        pool = moviesDatabase.filter(m => 
            selectedLangs.includes(m.language.toLowerCase()) && 
            (m.difficulty === 'medium' || m.difficulty === 'easy')
        );
    } else {
        // Hard: all languages, medium & hard difficulties
        pool = moviesDatabase.filter(m => m.difficulty === 'hard' || m.difficulty === 'medium');
    }

    if (pool.length === 0) {
        pool = [...moviesDatabase];
    }

    const unusedMovies = pool.filter(movie => !usedTitles.has(movie.title.toLowerCase()));
    const availableMovies = unusedMovies.length > 0 ? unusedMovies : pool;
    return shuffleMovies(availableMovies).slice(0, 3).map(formatMovieChoice);
}

/**
 * Normalizes movie titles and guesses for fair comparison
 */
export function normalizeTitle(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/['".,!?:;\-_()]/g, '') // remove punctuation
        .replace(/\s+/g, ' ')            // normalize spaces
        .trim();
}

function getPhoneticTitle(str) {
    const words = normalizeTitle(str)
        .replace(/^[\s]*the\s+/, '')
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) return '';

    return words.map(word => {
        const letters = word.replace(/[0-9]/g, '');
        if (!letters) return word;

        const soundexGroups = {
            b: '1', f: '1', p: '1', v: '1',
            c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
            d: '3', t: '3',
            l: '4',
            m: '5', n: '5',
            r: '6'
        };
        let code = letters[0].toUpperCase();
        let previousGroup = soundexGroups[letters[0]] || '';

        for (const letter of letters.slice(1)) {
            const group = soundexGroups[letter] || '';
            if (group && group !== previousGroup) code += group;
            previousGroup = group;
        }

        return code.padEnd(4, '0').slice(0, 4);
    }).join(' ');
}

export function matchesMovieTitle(guess, title) {
    const normalizedGuess = normalizeTitle(guess).replace(/^the\s+/, '');
    if (!normalizedGuess || !title) return false;

    const titleVariants = [
        title,
        String(title).split(/[:\u2013\u2014]/, 1)[0]
    ];
    const compactGuess = normalizedGuess.replace(/[^a-z0-9]/g, '');
    const phoneticGuess = getPhoneticTitle(normalizedGuess);

    return titleVariants.some((variant) => {
        const normalizedVariant = normalizeTitle(variant).replace(/^the\s+/, '');
        if (!normalizedVariant) return false;

        return normalizedGuess === normalizedVariant ||
            compactGuess === normalizedVariant.replace(/[^a-z0-9]/g, '') ||
            phoneticGuess === getPhoneticTitle(normalizedVariant);
    });
}

/**
 * Generate a masked representation of the movie title (e.g. "Dangal" -> "_ _ _ _ _ _")
 */
export function maskTitle(title) {
    if (!title) return '';
    return title.split('').map(char => {
        if (/[a-zA-Z0-9]/.test(char)) return '_';
        if (char === ' ') return '   ';
        return char;
    }).join(' ');
}
