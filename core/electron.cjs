const { app, BrowserWindow, ipcMain, protocol } = require('electron')
const path = require('path')
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
require('./login.cjs')
const pool = new Pool()

let db 
(async() => db = await pool.connect())()
// console.log(db)

const isDev = process.env.IS_DEV === "true"

// instaciante devtools variables if dev mode
let installExtension, REACT_DEVELOPER_TOOLS
if(isDev){
  const devTools = require('electron-devtools-installer')
  installExtension = devTools.default
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS
}


function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    autoHideMenuBar : true,
    show : false,
    minWidth: 1280,
    minHeight: 720,
    icon : path.join(__dirname, "logo.ico"),
    webPreferences: {
      contextIsolation : true,
      nodeIntegration : false,
      worldSafeExecuteJavaScript: true,
      preload : path.join(__dirname, "preload.js"),
      webSecurity : isDev ? false : true
    }
  })

  win.maximize()
  win.show()

  //load the index.html from a url
  // const filePath = path.join(path.join(__dirname, '../dist/index.html'))
  const filePath = path.join(`file://${path.join(__dirname, '../dist/index.html')}`)
  win.loadURL(isDev ? 'http://localhost:5173' : filePath);

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Devtools Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred during devtools installation ::: , ${error}`));

    // Open the DevTools.
    win.webContents.openDevTools()
  }

}
// fs.readdir(`${app.getAppPath()}/dist`, (err, files) => console.log("DIST -> ", files))
// fs.readdir(`${app.getAppPath()}/core`, (err, files) => console.log("CORE -> ", files))


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async() => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



// Custom actions

async function customFileCopy(Filepath){
  const newName = uuidv4()+'.jpeg'
  const newPath = isDev ? path.join(__dirname, '../pictures') : path.join(process.resourcesPath, 'pictures')
  const destination = path.join(newPath, newName)

  fs.copyFile(Filepath, destination, (err) => {
    if(err){
      console.log("error copying file...", err)
      throw new Error("error copying file. Aborting...")
    }
    else{ 
      console.log("File copied", [Filepath, destination])
    }
  })

  return destination

}

ipcMain.handle('login', async(event, args) => {
  // chech password validity
  const SQL = `SELECT id FROM login WHERE passtype='${args?.passtype}' AND password=crypt('${args.password}', password)`
  const answer = await db.query(SQL)
  if (answer.rowCount === 0) return false
  return true
}) 

ipcMain.handle('get-clients', async(event, args) => {

  const SQL = `SELECT * FROM "clients" ORDER BY "nom"`
  const answer = await db.query(SQL)
  return answer.rows
})

ipcMain.handle('get-client-basic-infos', async(event, args) => {
  const SQL = `SELECT * FROM "clients" WHERE id = ${args}`
  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('get-client-all-infos', async(event, args) => {
  const SQL = `SELECT * FROM "clients" JOIN mesures ON clients.mesuresid = mesures.id  WHERE clients.id = ${args}`
  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('get-clients-for-cmds', async(event, args) => {
  const SQL = `SELECT id, prenom, nom, tel from clients`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('delete-client', async(event, args) => {

  const SQL = `DELETE FROM clients WHERE id = ${args.cli}`
  const res = await db.query(SQL)

  // const SQL2 = `DELETE FROM mesures WHERE id = ${args.mes}`
  // await db.query(SQL2)

  return res.rowCount
  // returns 0 if nothing found, and 1 (or more) if deleted
})

ipcMain.handle('add-client', async(event, args) => {
  const SQL = 'INSERT INTO mesures (tour_ceinture, fesse, cuisse, longueur_pantalon, bas_pantalon, tour_cou, epaules, tour_poitrine, tour_bras, manche, tour_manche, longueur_haut, blouse, taille, mollet) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id'
  const res = await db.query(SQL, args.mesures)
  
  const SQL2 = 'INSERT INTO clients (nom, prenom, tel, adresse, mesuresid) VALUES($1, $2, $3, $4, $5) RETURNING id'
  const res2 = await db.query(SQL2, [...args.client, res.rows[0].id])

  return res2.rows[0].id
})

ipcMain.handle('update-client', async(event, args) => {
  const SQL = 'UPDATE clients SET nom = $1, prenom = $2, tel = $3, adresse = $4 WHERE id = $5'
  await db.query(SQL, args.client)
  const SQL2 = `UPDATE mesures SET tour_ceinture = $1, fesse = $2, cuisse = $3, longueur_pantalon = $4, bas_pantalon = $5, tour_cou = $6, epaules = $7, tour_poitrine = $8, tour_bras = $9, manche = $10, tour_manche = $11, longueur_haut = $12, blouse = $13, taille = $14, mollet = $15 WHERE id = $16`
  await db.query(SQL2, args.mesures)
})

ipcMain.handle('get-all-getzner', async(event, args) => {
  const SQL = `SELECT modeles.*, infos_modeles.taille, infos_modeles.quantite, infos_modeles.couleur, infos_modeles.modele, infos_modeles.prix FROM modeles INNER JOIN infos_modeles ON infos_modeles.modele = modeles.id WHERE categorie = 1 ORDER BY nom_modele`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('get-all-supercent', async(event, args) => {
  const SQL = `SELECT modeles.*, infos_modeles.taille, infos_modeles.quantite, infos_modeles.couleur, infos_modeles.modele, infos_modeles.prix FROM modeles INNER JOIN infos_modeles ON infos_modeles.modele = modeles.id WHERE categorie = 2 ORDER BY nom_modele`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('get-all-accessoires', async(event, args) => {
  const SQL = `SELECT modeles.*, infos_modeles.taille, infos_modeles.quantite, infos_modeles.couleur, infos_modeles.modele, infos_modeles.prix FROM modeles INNER JOIN infos_modeles ON infos_modeles.modele = modeles.id WHERE categorie = 3 ORDER BY nom_modele`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('get-caisse-content', async(event, args) => {
  const SQL = `SELECT caisse.*, TO_CHAR(caisse.date, 'DD-MM-YYYY') as dateFormat FROM caisse WHERE date = ${(args===null || args === '') ? 'CURRENT_DATE' : `'${args}'`} `
  // console.log(SQL)
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('get-caisse-total', async(event, args) => {
  const SQL = `SELECT COALESCE(SUM(entree), 0) - COALESCE(SUM(sortie), 0) AS total FROM caisse WHERE date = ${(args===null || args === '') ? 'CURRENT_DATE' : `'${args}'`} `
  const res = await db.query(SQL)
  return res.rows[0].total
})

ipcMain.handle('add-entry-to-caisse', async(event, args) => {
  const SQL = `INSERT INTO caisse (entree, libelle_entree, sortie, libelle_sortie) VALUES($1, $2, $3, $4)`
  await db.query(SQL, [args.entree, args.libelle_entree, args.sortie, args.libelle_sortie])
})

ipcMain.handle('get-models-categories', async(event, args) => {
  const SQL = `SELECT * FROM categories_modeles`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('add-model', async(event, args) => {{
  const filepath = (args.path !== null) ? await customFileCopy(args.path) : null 
  // console.log("FILE PATH IS :", filepath)

  const SQL = `INSERT INTO modeles (nom_modele, categorie, image)
  VALUES($1, $2, $3) RETURNING id`
  const res1 = await db.query(SQL, [...args.query1, filepath])

  const SQL2 = `INSERT INTO infos_modeles(taille, quantite, couleur, prix, modele)
  VALUES($1, $2, $3, $4, $5)`
  await db.query(SQL2, [...args.query2, res1.rows[0].id])
}})


ipcMain.handle('delete-model', async(event, args) => {

  const SQL = `DELETE FROM modeles WHERE id=${args}`
  await db.query(SQL)
})

ipcMain.handle('update-model', async(event, args) => {
  const filePath = (args.path) ? await customFileCopy(args.path) : null
  const SQL = `UPDATE modeles SET 
  nom_modele = updateIfChanged($1, nom_modele),
  image = updateIfChanged($2, image) 
  WHERE id = $3
  `
  // console.log("BEfore QUery 1")
  db.query(SQL, [...args.query1, filePath, args.modelID])
  // console.log("After QUery 1")
  
  
  // console.log("Before QUery 2")
  const SQL2 = `UPDATE infos_modeles SET
  taille = $1, 
  quantite = $2, 
  couleur = $3, 
  prix = $4 
  WHERE ID = $5
  `  
  db.query(SQL2, [...args.query2, args.infosID])
  
  // console.log("After QUery 2")
})

ipcMain.handle('get-one-model', async(event, args) => {
  const SQL = `SELECT modeles.*, infos_modeles.id as infos_id, infos_modeles.taille, infos_modeles.quantite, infos_modeles.couleur, infos_modeles.prix FROM modeles JOIN infos_modeles ON infos_modeles.modele = modeles.id WHERE modeles.id = ${args}`
  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('get-models-by-category', async(event, args) => {
  const SQL = `SELECT modeles.*, infos_modeles.id as infos_id, infos_modeles.taille, infos_modeles.quantite, infos_modeles.couleur, infos_modeles.prix FROM modeles JOIN infos_modeles ON infos_modeles.modele = modeles.id ORDER BY modeles.categorie DESC`
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('add-commande', async(event, args) => {
  const SQL = `INSERT INTO commandes(proprietaire, date_livraison, avance, remise, total) VALUES($1, $2, $3, $4, $5) RETURNING id`
  const res1 = await db.query(SQL, args.query1)
  const baseID = res1.rows[0].id

  const arr = args.produits
  let SQL2_part1 = `INSERT INTO commande_to_modele(commande_id, produit_id, quantite) VALUES`
  const SQL2_part2 = arr.map(i => (`(${baseID}, ${i.item}, ${i.quantite})`)).join(',')

  const SQL2 = SQL2_part1 + SQL2_part2
  await db.query(SQL2)
})

ipcMain.handle('get-commandes', async(event, args) => {
  const SQL = `SELECT commandes.id, commandes.valide, TO_CHAR(commandes.date_livraison, 'DD-MM-YYYY') AS date_livraison, 
  JSON_AGG(ROW(modeles.id, modeles.nom_modele, infos_modeles.taille, infos_modeles.couleur, commande_to_modele.quantite)) modeles, 
  JSON_AGG(ROW(clients.id, clients.prenom, clients.nom)) clients,
  commandes.avance, commandes.total
  FROM commandes 
  INNER JOIN commande_to_modele ON commande_to_modele.commande_id = commandes.id 
  INNER JOIN modeles ON commande_to_modele.produit_id = modeles.id 
  INNER JOIN clients ON commandes.proprietaire = clients.id
  INNER JOIN infos_modeles ON infos_modeles.modele = modeles.id
  WHERE commandes.valide = ${args}
  GROUP BY commandes.id
  ORDER BY date_livraison ASC;
  `
// console.log(SQL)
  const res = await db.query(SQL)
  return res.rows
})

ipcMain.handle('get-one-commande', async(event, args) => {
  const SQL = `SELECT commandes.id, commandes.valide, TO_CHAR(commandes.date_livraison, 'DD-MM-YYYY') AS date_livraison, commandes.remise,
  JSON_AGG(ROW(modeles.id, modeles.nom_modele, infos_modeles.taille, infos_modeles.couleur, commande_to_modele.quantite)) modeles, 
  JSON_AGG(ROW(clients.id, clients.prenom, clients.nom)) clients,
  commandes.avance, commandes.total
  FROM commandes 
  INNER JOIN commande_to_modele ON commande_to_modele.commande_id = commandes.id 
  INNER JOIN modeles ON commande_to_modele.produit_id = modeles.id 
  INNER JOIN clients ON commandes.proprietaire = clients.id
  INNER JOIN infos_modeles ON infos_modeles.modele = modeles.id
  WHERE commandes.id = $1
  GROUP BY commandes.id`
  const res = await db.query(SQL, [args])
  return res.rows[0]
})

ipcMain.handle('delete-entry', async (event, args) => {
  const SQL = `DELETE FROM caisse where id = ${args}`
  await db.query(SQL)
})

ipcMain.handle('delete-commande', async(event, args) => {
  const SQL = `DELETE FROM commandes WHERE id = ${args}`
  await db.query(SQL)
})

ipcMain.handle('validate-commande', async(event, args) => {

  const SQL = `UPDATE commandes SET valide = true WHERE id = '${args.id}'`
  await db.query(SQL)
})

ipcMain.handle('add-employe', async(event, args) => {
  const SQL = `INSERT INTO employes(prenom, nom, telephone, salaire) VALUES($1, $2, $3, $4)`
  await db.query(SQL, args)
})

ipcMain.handle('get-employes', async(event, args) => {
  const SQL = `SELECT * FROM employes ORDER BY nom`
  const res = await db.query(SQL)

  return res.rows
})

ipcMain.handle('delete-employe', async(event, args) => {
  const SQL = `DELETE FROM employes WHERE id = ${args}`
  await db.query(SQL)
})

ipcMain.handle('get-factures-infos', async(event, args) => {
  const SQL = `SELECT 
  commandes.id, commandes.date_livraison, commandes.avance, commandes.remise, commandes.total,
  commande_to_modele.quantite,
  modeles.nom_modele, 
  infos_modeles.prix
  FROM commandes  
  JOIN commande_to_modele ON commandes.id = commande_to_modele.commande_id 
  JOIN modeles ON modeles.id = commande_to_modele.produit_id
  JOIN infos_modeles ON infos_modeles.modele = modeles.id
  WHERE commandes.id = $1;
  `
  const res = await db.query(SQL, [args])
  return res.rows
})

ipcMain.handle('get-factures-count', async(event, args) => {
  const SQL = `SELECT * FROM facturation`
  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('set-factures-count', async(event, args) => {
  const SQL = `UPDATE facturation SET count = $1`
  await db.query(SQL, [args])
})

ipcMain.handle('get-total-salaires', async(event, args) => {
  const SQL = `SELECT count(montant) FROM salaires`
  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('pay-employees', async(event, args) => {
  const SQL = `INSERT INTO salaires(montant) VALUES(${args})`
  await db.query(SQL)
})

ipcMain.handle('get-compta-generale', async(event, args) => {
  const SQL = `
  SELECT 
      (SELECT COALESCE(SUM(entree), 0) FROM caisse WHERE EXTRACT(MONTH FROM date) = ${args.month} AND EXTRACT(YEAR FROM date) = ${args.year}) AS entree, 
      (SELECT COALESCE(SUM(sortie), 0) FROM caisse WHERE EXTRACT(MONTH FROM date) = ${args.month} AND EXTRACT(YEAR FROM date) = ${args.year}) AS sortie, 
      (SELECT COALESCE(SUM(montant), 0) FROM salaires WHERE EXTRACT(MONTH FROM date_paiement) = ${args.month} AND EXTRACT(YEAR FROM date_paiement) = ${args.year}) AS salaires,
      (SELECT COUNT(*) FROM commandes WHERE EXTRACT(MONTH FROM date_creation) = ${args.month} AND EXTRACT(YEAR FROM date_creation) = ${args.year}) AS nombre_commandes;
  `

  const res = await db.query(SQL)
  return res.rows[0]
})

ipcMain.handle('check-if-paid-is-done', async(event, args) => {
  const SQL = `SELECT * FROM salaires WHERE EXTRACT(MONTH FROM date_paiement) = $1 AND EXTRACT(YEAR FROM date_paiement) = $2`
  const res = await db.query(SQL, args)

  if(res.rows.length === 0){
    return true
  }

  return false
})

ipcMain.handle('change-password', async(event, args) => {
  const SQL = "UPDATE login SET password= crypt($1, gen_salt('bf')) WHERE passtype=$2"
  await db.query(SQL, args)
})

ipcMain.handle('get-employee-infos', async(event, args) => {
  const SQL = 'SELECT * FROM employes WHERE id=$1'
  const res = await db.query(SQL, [args])
  return res.rows[0]
})

ipcMain.handle('update-employee', async(event, args) => {
  const SQL = 'UPDATE employes SET prenom = $1, nom = $2, telephone = $3, salaire = $4 WHERE id = $5'
  await db.query(SQL, args)
})

ipcMain.handle('manual-auto-decrement', async(event, args) => {
  const SQL = 'UPDATE infos_modeles SET quantite = $1 WHERE modele = $2'
  await db.query(SQL, args)
})