from os import getcwd, path, chdir
chdir(path.join(getcwd(), 'src', 'schemas'))
print("Init SQL generation script...")

START = 0
MAX = 14
f1 = path.join(getcwd(), f"{MAX}_mesures.psql")
f2 = path.join(getcwd(), f"{MAX}_clients.psql")


with open(f1, 'w+') as file:
    file.write("INSERT INTO mesures(c, e, m , la, lb) \nVALUES")
    for i in range(1, MAX):
        file.write("({}, {}, {}, {}, {}),\n".format(i, i*2, i*3, i*4, i*5))
    
    i += 1
    file.write("({}, {}, {}, {}, {});\n".format(i, i*2, i*3, i*4, i*5))
    
with open(f2, 'w+') as file:
    file.write("INSERT INTO clients(nom, prenom, tel, adresse, mesuresid) \nVALUES")
    for i in range(1, MAX):
        file.write(f"('doe', 'john', '77 890 90 89', '127.0.0.1', {START}),\n")
        START += 1
    
    i += 1
    file.write(f"('delgado', 'mani', '+555 278 90 09 1', 'Californie', {START});\n")