-- Seed Data Script for Booklend Application
-- This script is reexecutable: it deletes existing data and re-inserts it
--
-- HOW TO EXECUTE THIS SCRIPT:
-- Option 1 (from project root):
--   PGPASSWORD=postgres psql -h localhost -U postgres -d booklend_db -f src/main/resources/insert-books.sql
--
-- Option 2 (from backend directory):
--   cd /path/to/booklend-backend
--   PGPASSWORD=postgres psql -h localhost -U postgres -d booklend_db -f src/main/resources/insert-books.sql
--
-- Option 3 (interactive, will prompt for password):
--   psql -h localhost -U postgres -d booklend_db -f src/main/resources/insert-books.sql
--
-- Note: This script will DELETE all existing books, users (except admin), and rentals before inserting new data!

ALTER TABLE rentals DISABLE TRIGGER ALL;

DELETE FROM rentals;
DELETE FROM books;
DELETE FROM users WHERE role != 'ADMIN'; 

ALTER TABLE rentals ENABLE TRIGGER ALL;

INSERT INTO users (email, password, first_name, last_name, role) VALUES
('john.doe@booklend.com', '$2a$10$ukD4QfteKORB6VYC1p.N.uEwqv70I911nEIolCqHhWor5WwCkLHYe', 'John', 'Doe', 'USER'),
('jane.smith@booklend.com', '$2a$10$ukD4QfteKORB6VYC1p.N.uEwqv70I911nEIolCqHhWor5WwCkLHYe', 'Jane', 'Smith', 'USER'),
('bob.wilson@booklend.com', '$2a$10$ukD4QfteKORB6VYC1p.N.uEwqv70I911nEIolCqHhWor5WwCkLHYe', 'Bob', 'Wilson', 'USER'),
('alice.brown@booklend.com', '$2a$10$ukD4QfteKORB6VYC1p.N.uEwqv70I911nEIolCqHhWor5WwCkLHYe', 'Alice', 'Brown', 'USER'),
('charlie.davis@booklend.com', '$2a$10$ukD4QfteKORB6VYC1p.N.uEwqv70I911nEIolCqHhWor5WwCkLHYe', 'Charlie', 'Davis', 'USER');

INSERT INTO books (title, author, genre, summary, stock_count, image_filename) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'A classic American novel about the Jazz Age', 5, 'gatsby.jpg'),
('1984', 'George Orwell', 'Dystopian', 'A dystopian social science fiction novel', 3, '1984.jpg'),
('Pride and Prejudice', 'Jane Austen', 'Romance', 'A romantic novel of manners and social commentary', 4, 'pride.jpg'),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'A fantasy adventure set in Middle-earth', 6, 'hobbit.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'A gripping tale of racial injustice and childhood innocence', 7, 'mockingbird.jpg'),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 'A coming-of-age novel about teenage alienation', 4, 'catcher.jpg'),
('Brave New World', 'Aldous Huxley', 'Dystopian', 'A futuristic society where happiness is enforced', 5, 'brave-new-world.jpg'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', 'An epic fantasy trilogy about the quest to destroy the One Ring', 8, 'lotr.jpg'),
('Wuthering Heights', 'Emily Brontë', 'Romance', 'A dark romantic novel set on the Yorkshire moors', 3, 'wuthering.jpg'),
('Jane Eyre', 'Charlotte Brontë', 'Romance', 'A classic tale of love and independence', 6, 'jane-eyre.jpg'),
('The Count of Monte Cristo', 'Alexandre Dumas', 'Adventure', 'A thrilling story of revenge and redemption', 5, 'monte-cristo.jpg'),
('Les Misérables', 'Victor Hugo', 'Historical', 'An epic novel of love, loss, and revolution in France', 4, 'les-miserables.jpg'),
('The Three Musketeers', 'Alexandre Dumas', 'Adventure', 'A swashbuckling tale of friendship and adventure', 6, 'three-musketeers.jpg'),
('Moby Dick', 'Herman Melville', 'Adventure', 'The epic tale of Captain Ahab and the white whale', 3, 'moby-dick.jpg'),
('Crime and Punishment', 'Fyodor Dostoevsky', 'Psychological', 'A psychological thriller about guilt and redemption', 4, 'crime-punishment.jpg'),
('Anna Karenina', 'Leo Tolstoy', 'Romance', 'An epic novel about love, family, and society', 5, 'anna-karenina.jpg'),
('War and Peace', 'Leo Tolstoy', 'Historical', 'A sweeping epic set during the Napoleonic Wars', 6, 'war-peace.jpg'),
('The Grapes of Wrath', 'John Steinbeck', 'Fiction', 'A powerful story of poverty and perseverance', 4, 'grapes-wrath.jpg'),
('Of Mice and Men', 'John Steinbeck', 'Fiction', 'A novella about friendship and shattered dreams', 7, 'mice-men.jpg'),
('The Old Man and the Sea', 'Ernest Hemingway', 'Fiction', 'A novella about an old fisherman''s epic struggle', 5, 'old-man-sea.jpg'),
('Fahrenheit 451', 'Ray Bradbury', 'Science Fiction', 'A dystopian novel about censorship and knowledge', 6, 'fahrenheit-451.jpg'),
('Foundation', 'Isaac Asimov', 'Science Fiction', 'A series about the fall and rise of a galactic empire', 4, 'foundation.jpg'),
('Dune', 'Frank Herbert', 'Science Fiction', 'An epic sci-fi novel set on the desert planet Arrakis', 5, 'dune.jpg'),
('The Handmaid''s Tale', 'Margaret Atwood', 'Dystopian', 'A chilling tale of a totalitarian society', 6, 'handmaids-tale.jpg'),
('Beloved', 'Toni Morrison', 'Fiction', 'A powerful story about slavery and its aftermath', 4, 'beloved.jpg'),
('The Invisible Man', 'Ralph Ellison', 'Fiction', 'A novel exploring identity and invisibility in America', 3, 'invisible-man.jpg'),
('The Great Expectations', 'Charles Dickens', 'Fiction', 'A coming-of-age story set in Victorian England', 5, 'great-expectations.jpg'),
('A Tale of Two Cities', 'Charles Dickens', 'Historical', 'An epic tale set during the French Revolution', 6, 'tale-two-cities.jpg'),
('Oliver Twist', 'Charles Dickens', 'Fiction', 'A story of orphan life in Victorian London', 4, 'oliver-twist.jpg'),
('David Copperfield', 'Charles Dickens', 'Fiction', 'A coming-of-age autobiographical novel', 5, 'david-copperfield.jpg'),
('The Picture of Dorian Gray', 'Oscar Wilde', 'Fiction', 'A philosophical novel about beauty and morality', 7, 'dorian-gray.jpg'),
('Sense and Sensibility', 'Jane Austen', 'Romance', 'A tale of two sisters and their romantic pursuits', 4, 'sense-sensibility.jpg'),
('Emma', 'Jane Austen', 'Romance', 'A novel about matchmaking and self-deception', 5, 'emma.jpg'),
('Northanger Abbey', 'Jane Austen', 'Romance', 'A satirical novel about Gothic novel obsession', 3, 'northanger-abbey.jpg'),
('The Secret Garden', 'Frances Hodgson Burnett', 'Fantasy', 'A magical tale of transformation and healing', 6, 'secret-garden.jpg'),
('Alice in Wonderland', 'Lewis Carroll', 'Fantasy', 'A whimsical tale of a girl''s adventure down a rabbit hole', 8, 'alice-wonderland.jpg'),
('Treasure Island', 'Robert Louis Stevenson', 'Adventure', 'A classic adventure tale of pirates and treasure', 5, 'treasure-island.jpg'),
('The Jungle Book', 'Rudyard Kipling', 'Fantasy', 'A collection of stories about a boy raised by animals', 4, 'jungle-book.jpg'),
('Peter Pan', 'J.M. Barrie', 'Fantasy', 'A magical tale of a boy who never grows up', 7, 'peter-pan.jpg'),
('The Wonderful Wizard of Oz', 'L. Frank Baum', 'Fantasy', 'A fantastical journey through the land of Oz', 6, 'wizard-oz.jpg'),
('Black Beauty', 'Anna Sewell', 'Fiction', 'A touching story told from a horse''s perspective', 4, 'black-beauty.jpg'),
('Anne of Green Gables', 'Lucy Maud Montgomery', 'Fiction', 'A coming-of-age story of an imaginative girl', 5, 'anne-green-gables.jpg'),
('The Adventures of Tom Sawyer', 'Mark Twain', 'Fiction', 'A classic tale of boyhood adventures', 6, 'tom-sawyer.jpg'),
('The Adventures of Huckleberry Finn', 'Mark Twain', 'Fiction', 'A sequel featuring adventures along the Mississippi', 5, 'huckleberry-finn.jpg'),
('Robinson Crusoe', 'Daniel Defoe', 'Adventure', 'The tale of a man shipwrecked on an island', 4, 'robinson-crusoe.jpg'),
('Gulliver''s Travels', 'Jonathan Swift', 'Adventure', 'A satirical tale of extraordinary voyages', 3, 'gullivers-travels.jpg'),
('Frankenstein', 'Mary Shelley', 'Science Fiction', 'A gothic tale of scientific ambition and tragedy', 6, 'frankenstein.jpg'),
('Dracula', 'Bram Stoker', 'Horror', 'A epistolary novel about a vampire''s invasion of England', 5, 'dracula.jpg'),
('The Haunting of Hill House', 'Shirley Jackson', 'Horror', 'A psychological horror about a haunted mansion', 4, 'haunting-hill-house.jpg'),
('The Shining', 'Stephen King', 'Horror', 'A horror novel set in an isolated hotel', 5, 'the-shining.jpg'),
('It', 'Stephen King', 'Horror', 'An epic horror novel about childhood terrors', 3, 'it.jpg'),
('The Stand', 'Stephen King', 'Science Fiction', 'A post-apocalyptic epic about good versus evil', 6, 'the-stand.jpg'),
('Misery', 'Stephen King', 'Thriller', 'A psychological thriller about an obsessed fan', 4, 'misery.jpg'),
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Thriller', 'A gripping mystery set in Sweden', 7, 'dragon-tattoo.jpg'),
('Gone Girl', 'Gillian Flynn', 'Thriller', 'A twisty psychological thriller about a missing wife', 8, 'gone-girl.jpg'),
('The Da Vinci Code', 'Dan Brown', 'Thriller', 'A fast-paced mystery involving art and history', 6, 'da-vinci-code.jpg'),
('Angels & Demons', 'Dan Brown', 'Thriller', 'A prequel involving science and religion', 5, 'angels-demons.jpg'),
('The Hunger Games', 'Suzanne Collins', 'Dystopian', 'A dystopian tale of a televised death match', 9, 'hunger-games.jpg'),
('Catching Fire', 'Suzanne Collins', 'Dystopian', 'A sequel to The Hunger Games', 8, 'catching-fire.jpg'),
('Mockingjay', 'Suzanne Collins', 'Dystopian', 'The final book in The Hunger Games trilogy', 7, 'mockingjay.jpg'),
('Divergent', 'Veronica Roth', 'Dystopian', 'A dystopian tale of a girl who doesn''t fit in', 8, 'divergent.jpg'),
('The Maze Runner', 'James Dashner', 'Science Fiction', 'A young man wakes up in a mysterious maze', 7, 'maze-runner.jpg'),
('Ready Player One', 'Ernest Cline', 'Science Fiction', 'A virtual reality adventure in a dystopian future', 6, 'ready-player-one.jpg'),
('Snow Crash', 'Neal Stephenson', 'Science Fiction', 'A cyberpunk novel about virtual reality and pizza', 5, 'snow-crash.jpg'),
('Neuromancer', 'William Gibson', 'Science Fiction', 'The cyberpunk novel that defined the genre', 4, 'neuromancer.jpg'),
('The Martian', 'Andy Weir', 'Science Fiction', 'A gripping tale of survival on Mars', 7, 'the-martian.jpg'),
('Ender''s Game', 'Orson Scott Card', 'Science Fiction', 'A tale of a gifted child trained as a military genius', 6, 'enders-game.jpg'),
('Hyperion', 'Dan Simmons', 'Science Fiction', 'An epic sci-fi novel inspired by The Canterbury Tales', 5, 'hyperion.jpg'),
('The Name of the Wind', 'Patrick Rothfuss', 'Fantasy', 'A fantasy novel about a legendary figure telling his story', 8, 'name-of-wind.jpg'),
('A Song of Ice and Fire', 'George R.R. Martin', 'Fantasy', 'An epic fantasy series with complex characters', 9, 'song-ice-fire.jpg'),
('The Way of Kings', 'Brandon Sanderson', 'Fantasy', 'An epic fantasy with an intricate magic system', 7, 'way-of-kings.jpg'),
('Mistborn', 'Brandon Sanderson', 'Fantasy', 'A fantasy epic about overthrowing an empire', 8, 'mistborn.jpg'),
('The Name of All Things', 'Jenn Lyons', 'Fantasy', 'A fantasy novel with a mysterious magic system', 6, 'name-all-things.jpg'),
('Six of Crows', 'Leigh Bardugo', 'Fantasy', 'A heist novel set in a fantasy world', 7, 'six-of-crows.jpg'),
('The Poppy War', 'R.F. Kuang', 'Fantasy', 'A dark fantasy inspired by Chinese history', 6, 'poppy-war.jpg'),
('Circe', 'Madeline Miller', 'Fantasy', 'A retelling of the Greek goddess Circe''s story', 5, 'circe.jpg'),
('The Song of Achilles', 'Madeline Miller', 'Fantasy', 'A retelling of the Trojan War through a new lens', 5, 'song-achilles.jpg'),
('Greek Myths', 'Stephen Fry', 'Fantasy', 'A modern retelling of classic Greek mythology', 6, 'greek-myths.jpg'),
('American Gods', 'Neil Gaiman', 'Fantasy', 'A tale of old gods in modern America', 7, 'american-gods.jpg'),
('Norse Mythology', 'Neil Gaiman', 'Fantasy', 'A retelling of classic Norse myths', 6, 'norse-mythology.jpg'),
('The Ocean at the End of the Lane', 'Neil Gaiman', 'Fantasy', 'A magical tale of childhood and wonder', 5, 'ocean-end-lane.jpg'),
('Coraline', 'Neil Gaiman', 'Horror', 'A dark children''s novella about parallel worlds', 7, 'coraline.jpg'),
('Good Omens', 'Neil Gaiman & Terry Pratchett', 'Fantasy', 'A comedic tale of an angel and demon preventing the apocalypse', 8, 'good-omens.jpg'),
('The Colour of Magic', 'Terry Pratchett', 'Fantasy', 'The first Discworld novel with humor and satire', 6, 'colour-of-magic.jpg'),
('Guards! Guards!', 'Terry Pratchett', 'Fantasy', 'A Discworld novel about city watch and dragons', 7, 'guards-guards.jpg'),
('Small Gods', 'Terry Pratchett', 'Fantasy', 'A Discworld novel exploring faith and religion', 5, 'small-gods.jpg'),
('The Invisible Man''s Diary', 'Jane Austen', 'Romance', 'A humorous retelling with romance elements', 4, 'invisible-mans-diary.jpg'),
('Outlander', 'Diana Gabaldon', 'Romance', 'A time-travel romance set in Scotland', 8, 'outlander.jpg'),
('The Bronze Horseman', 'Paullina Simons', 'Romance', 'A passionate historical romance set in Russia', 6, 'bronze-horseman.jpg'),
('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'Romance', 'A glamorous tale of a reclusive actress revealing her past', 7, 'seven-husbands.jpg'),
('Lessons in Chemistry', 'Bonnie Garmus', 'Fiction', 'A novel about a female chemist in 1960s California', 6, 'lessons-chemistry.jpg'),
('The Nightingale', 'Kristin Hannah', 'Historical', 'A powerful tale of sisterhood during WWII', 7, 'the-nightingale.jpg'),
('All the Light We Cannot See', 'Anthony Doerr', 'Historical', 'An intertwined story of two teens during WWII', 8, 'all-light-cannot-see.jpg'),
('The Book Thief', 'Markus Zusak', 'Historical', 'A novel about stealing books during Nazi Germany', 8, 'book-thief.jpg');


INSERT INTO rentals (user_id, book_id, rental_date, due_date, returned) VALUES
((SELECT id FROM users WHERE email = 'john.doe@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'The Great Gatsby' LIMIT 1), '2026-01-05', '2026-01-19', false),
((SELECT id FROM users WHERE email = 'john.doe@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'Pride and Prejudice' LIMIT 1), '2026-01-03', '2026-01-17', false),
((SELECT id FROM users WHERE email = 'john.doe@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'To Kill a Mockingbird' LIMIT 1), '2025-12-20', '2026-01-03', true),
((SELECT id FROM users WHERE email = 'john.doe@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'Brave New World' LIMIT 1), '2026-01-08', '2026-01-22', false);

INSERT INTO rentals (user_id, book_id, rental_date, due_date, returned) VALUES
((SELECT id FROM users WHERE email = 'jane.smith@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = '1984' LIMIT 1), '2026-01-06', '2026-01-20', false),
((SELECT id FROM users WHERE email = 'jane.smith@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'The Hobbit' LIMIT 1), '2026-01-07', '2026-01-21', false);

INSERT INTO rentals (user_id, book_id, rental_date, due_date, returned) VALUES
((SELECT id FROM users WHERE email = 'bob.wilson@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'Jane Eyre' LIMIT 1), '2025-12-15', '2025-12-29', true),
((SELECT id FROM users WHERE email = 'bob.wilson@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'The Count of Monte Cristo' LIMIT 1), '2026-01-04', '2026-01-18', false),
((SELECT id FROM users WHERE email = 'bob.wilson@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'Les Misérables' LIMIT 1), '2026-01-09', '2026-01-23', false);

INSERT INTO rentals (user_id, book_id, rental_date, due_date, returned) VALUES
((SELECT id FROM users WHERE email = 'alice.brown@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'The Catcher in the Rye' LIMIT 1), '2026-01-05', '2026-01-19', false),
((SELECT id FROM users WHERE email = 'alice.brown@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'The Three Musketeers' LIMIT 1), '2026-01-06', '2026-01-20', false);

INSERT INTO rentals (user_id, book_id, rental_date, due_date, returned) VALUES
((SELECT id FROM users WHERE email = 'charlie.davis@booklend.com' LIMIT 1), (SELECT id FROM books WHERE title = 'Moby Dick' LIMIT 1), '2026-01-08', '2026-01-22', false);

SELECT '--- USERS INSERTED ---' as status;
SELECT COUNT(*) as user_count FROM users;

SELECT '--- BOOKS INSERTED ---' as status;
SELECT COUNT(*) as book_count FROM books;

SELECT '--- RENTALS INSERTED ---' as status;
SELECT COUNT(*) as rental_count FROM rentals;

SELECT '--- SAMPLE OF BOOKS ---' as status;
SELECT id, title, author, genre, stock_count FROM books LIMIT 10;

SELECT '--- SAMPLE OF RENTALS ---' as status;
SELECT r.id, u.email, b.title, r.rental_date, r.due_date, r.returned 
FROM rentals r
JOIN users u ON r.user_id = u.id
JOIN books b ON r.book_id = b.id
LIMIT 10;

