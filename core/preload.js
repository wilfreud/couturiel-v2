const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {

    login : (args) => {
        const response = ipcRenderer.invoke('login', args)
        return response
    },


    getClients : (args) => {
        const response = ipcRenderer.invoke('get-clients', args)
        return response
    },

    getClientsForCommandes : (args) => {
        const response = ipcRenderer.invoke('get-clients-for-cmds', args)
        return response
    },

    getClientBasicInfos : (args) => {
        const response = ipcRenderer.invoke('get-client-basic-infos', args)
        return response
    },
    
    getClientAllInfos : (args) => {
        const response = ipcRenderer.invoke('get-client-all-infos', args)
        return response
    },

    deleteClient : (args) => {
        const response = ipcRenderer.invoke('delete-client', args)
        return response
    },

    addClient : (args) => {
        const response = ipcRenderer.invoke('add-client', args)
        return response
    },

    updateClient : (args) => {
        const response = ipcRenderer.invoke('update-client', args)
        return response
    },


    getAllModeles : (args) => {
        const response = ipcRenderer.invoke('get-all-models', args)
        return response
    },

    getAllGetzner : (args) => {
        const response = ipcRenderer.invoke('get-all-getzner', args) 
        return response
    },

    getAllSupercent : (args) => {
        const response = ipcRenderer.invoke('get-all-supercent', args)
        return response
    },

    getAllAccessoires : (args) => {
        const response = ipcRenderer.invoke('get-all-accessoires', args)
        return response
    },


    getCaisseContent : (args) => {
        const response = ipcRenderer.invoke('get-caisse-content', args)
        return response
    },

    getCaisseTotal : (args) => {
        const response = ipcRenderer.invoke('get-caisse-total', args)
        return response
    },

    addEntryToCaisse : (args) => {
        const response = ipcRenderer.invoke('add-entry-to-caisse', args)
        return response
    },
    

    getModelCategories :(args) => {
        const response = ipcRenderer.invoke('get-models-categories', args)
        return response
    },

    addModel : (args) => {
        const response = ipcRenderer.invoke('add-model', args)
        return response
    },

    deleteModel : (args) => {
        const response = ipcRenderer.invoke('delete-model', args)
        return response
    },

    updateModel : (args) => {
        const response = ipcRenderer.invoke('update-model', args)
        return response
    },

    getOneModel : (args) => {
        const response = ipcRenderer.invoke('get-one-model', args)
        return response
    },

    getModelsByCategory : (args) => {
        const response = ipcRenderer.invoke('get-models-by-category', args)
        return response
    },

    addCommande : (args) => {
        const response = ipcRenderer.invoke('add-commande', args)
        return response
    },

    getCommandes : (args) => {
        const response = ipcRenderer.invoke('get-commandes', args)
        return response
    },

    getOneCommande : (args) => {
        const response = ipcRenderer.invoke('get-one-commande', args)
        return response
    },

    deleteEntry : (args) => {
        const response = ipcRenderer.invoke('delete-entry', args)
        return response
    },

    deleteCommande : (args) => {
        const response = ipcRenderer.invoke('delete-commande', args)
        return response
    },

    validateCommande : (args) => {
        const response = ipcRenderer.invoke('validate-commande', args)
        return response
    },

    addEmploye : (args) => {
        const response = ipcRenderer.invoke('add-employe', args)
        return response
    },

    getEmployes : (args) => {
        const response = ipcRenderer.invoke('get-employes', args)
        return response
    },

    deleteEmploye : (args) => {
        const response = ipcRenderer.invoke('delete-employe', args)
        return response
    },

    getFacturesInfos : (args) => {
        const response = ipcRenderer.invoke('get-factures-infos', args)
        return response
    },

    getFactureClientInfos : (args) => {
        const response = ipcRenderer.invoke('get-facture-clients-infos', args)
        return response
    },

    getFacturesCount : (args) => {
        const response = ipcRenderer.invoke('get-factures-count', args)
        return response
    },

    setFacturesCount : (args) => {
        const response = ipcRenderer.invoke('set-factures-count', args)
        return response
    },

    getSalaires : (args) => {
        const response = ipcRenderer.invoke('get-salaires', args)
        return response
    },

    payEmployees : (args) => {
        const response = ipcRenderer.invoke('pay-employees', args)
        return response
    },

    getComptaGenerale : (args) => {
        const response = ipcRenderer.invoke('get-compta-generale', args)
        return response
    },

    checkIfPaidIsDone : (args) => {
        const response = ipcRenderer.invoke('check-if-paid-is-done', args)
        return response
    },

    changePassword : (args) => {
        const response = ipcRenderer.invoke('change-password', args)
        return response
    },

    getEmployeeInfos : (args) => {
        const response = ipcRenderer.invoke('get-employee-infos', args)
        return response
    },

    updateEmployee : (args) => {
        const response = ipcRenderer.invoke('update-employee', args)
        return response
    },

    manualAutoDecrement : (args) => {
        const response = ipcRenderer.invoke('manual-auto-decrement', args)
        return response
    }
 

})