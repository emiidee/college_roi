import csv

with open('data_clean.csv', 'rU') as csvfile:
    with open('data.js', 'w') as writer:
        writer.write(
            "var data = [\n    {0}\n];".format(
                ",\n    ".join("[{0}]".format(",".join('"{0}"'.format(x) for x in row))
                           for row in csv.reader(csvfile, delimiter=","))))
