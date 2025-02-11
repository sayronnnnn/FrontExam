let records = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { employeeId, action } = req.body;
    const date = new Date().toLocaleDateString();

    let existingRecord = records.find(
      (record) => record.employeeId === employeeId && record.date === date
    );

    if (action === "timeIn") {
      if (!existingRecord) {
        const newRecord = {
          id: records.length + 1,
          date,
          employeeId,
          timeIn: new Date().toLocaleTimeString(),
          timeOut: null,
        };
        records.push(newRecord);
      }
    } else if (action === "timeOut") {
      if (existingRecord && !existingRecord.timeOut) {
        existingRecord.timeOut = new Date().toLocaleTimeString();
      }
    }

    res.status(200).json({ success: true, records });
  } else if (req.method === "GET") {
    res.status(200).json({ records });
  } else {
    res.status(405).end(); 
  }
}
