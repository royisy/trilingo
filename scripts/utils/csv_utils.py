import csv
import io


def read_csv(csv_file, fieldnames) -> list:
    csv_rows = None
    with open(csv_file, "r") as f:
        csv_reader = csv.DictReader(f, fieldnames=fieldnames)
        csv_rows = list(csv_reader)
    return csv_rows


def read_csv_str(csv_str, fieldnames) -> list:
    csv_file = io.StringIO(csv_str)
    csv_reader = csv.DictReader(csv_file, fieldnames=fieldnames)
    return list(csv_reader)


def clear_csv(csv_file):
    pass
    # with open(csv_file, "w") as f:
    #     writer = csv.writer(f)
    #     writer.writerows("")


def append_csv(csv_file, data):
    with open(csv_file, "a") as f:
        writer = csv.writer(f)
        writer.writerows(data)


def merge_csv(src_data, add_data, key):
    for src_row in src_data:
        for add_row in add_data:
            if src_row["id"] == add_row["id"]:
                src_row[key] = add_row[key]
                break
    return src_data
