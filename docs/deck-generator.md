# Deck CSV File Generator

This script generates deck CSV files from a word CSV file.  
Source CSV files can be made using websites like Wiktionary.  
https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists

## Supporting A New Language

1. Add the new language to `scripts/models/language.py`.
2. Modify prompts and the source code for the new language.

## Steps To Generate A Deck CSV File

1. Add the OpenAI API key to the `.env` file.

2. Create a source CSV file with IDs and words in `scripts/csv/`.  
   Example:

```
1,word 1
2,word 2
3,word 3
```

3. Add parts of speech:

```
# "de" is language code
python scripts/deck_generator.py de pos
```

4. Convert words to base form:

```
python scripts/deck_generator.py de base
```

5. Remove duplicated answers:

```
python scripts/deck_generator.py de dup_ans
```

Review and correct any errors.

6. Add definitions:

```
python scripts/deck_generator.py de def
```

Review and correct any errors.

7. Rename the source CSV file `definition.csv` to `dup_definition.csv` for the next step.

8. Remove any duplicated definitions:

```
python scripts/deck_generator.py de dup_def --chunk 100
```

Review and correct any errors.  
Repeat step 8 with a smaller chunk size until no duplicates remain.

9. Finalize the deck CSV file:

```
python scripts/deck_generator.py de fin
```

## Run Unit Tests

```
python -m pytest
```
