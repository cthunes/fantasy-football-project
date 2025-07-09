import pandas as pd

currentYear = 2025
years = 5
positions = ["qb", "rb", "wr", "te", "k", "dst"]

def validate(pos, year):
    header = 1
    if pos == "k" or pos == "dst":
        header = 0
    df = pd.read_csv("raw/{}/{}.csv".format(pos, year), header=header)
    weeks = set(range(1, 18))
    if year >= 2021:
        weeks.add(18)
    return set(df["Week"].unique()) == weeks

missing = []
for pos in positions:
    for year in range(currentYear - years, currentYear):
        if validate(pos, year):
            print("All weeks for {} in {} are present.".format(pos, year))
        else:
            print("Missing weeks for {} in {}.".format(pos, year))
            missing.append((pos, year))

print("Missing weeks for the following positions and years:", missing.__str__())