const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');
const { writeLog } = require('../../log'); 

router.get('/:table', async (req, res) => {
  const table = req.params.table;
  try{
    const conditions = createConditions(req);
    const data = await dataService.getItemByConditions(table, conditions.length ? conditions : undefined);
    writeLog(`Fetched data from table=${table} with conditions=${JSON.stringify(conditions)}`, 'info');
    res.json(data);
  } catch (err) {
    console.error(err);
    writeLog(`ERROR fetching data from table=${table} - ${err.message}`, 'error'); 
    res.status(500).json({ error: `ERROR requesting ${table}` });
  }
});

router.get('/:table/:itemId', async (req, res) => {
  const tableName = req.params.table.slice(0, -1);
  try {
    const conditions = createConditions(req);
    conditions.push({ field: 'id', value: req.params.itemId });
    const item = await dataService.getItemByConditions(req.params.table, conditions);
    writeLog(`Fetched itemId=${req.params.itemId} from table=${req.params.table} with conditions=${JSON.stringify(conditions)}`, 'info');
    res.json(item);
  }
  catch (err) {
    console.error(err);
    writeLog(`ERROR fetching itemId=${req.params.itemId} from table=${req.params.table} - ${err.message}`, 'error'); 
    res.status(500).json({ error: `ERROR requesting ${tableName} by id` });
  }
});

router.get('/:parentTable/:parentId/:childTable', async (req, res) => {
  const parentName = req.params.parentTable.slice(0, -1);
  try {
    const conditions = createConditions(req);
    conditions.push({ field: `${parentName}_id`, value: req.params.parentId });
    const data = await dataService.getItemByConditions(req.params.childTable, conditions);
    writeLog(`Fetched child data from childTable=${req.params.childTable} with parentId=${req.params.parentId} and conditions=${JSON.stringify(conditions)}`, 'info');
    res.json(data);
  }
  catch (err) {
    console.error(err);
    writeLog(`ERROR fetching child data from childTable=${req.params.childTable} with parentId=${req.params.parentId} - ${err.message}`, 'error');
    res.status(500).json({ error: `ERROR requesting ${req.params.childTable} by ${parentName} id` });
  }
});

const createConditions = (req) => {
  const query = req.query;
  if (query.user_id === 'null') {
    query.user_id = req.user?.id;
  }
  let conditions = [];
  if (Object.keys(query).length > 0) {
    conditions = Object.entries(query).map(([key, value]) => ({
      field: key,
      value: isNaN(value) ? value : Number(value)
    }));
  }
  return conditions;
};

module.exports = router;
