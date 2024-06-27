import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/data')
            .then(response => {
                setData(response.data);
                $(document).ready(() => {
                    if ($.fn.DataTable.isDataTable('#dataTable')) {
                        $('#dataTable').DataTable().clear().rows.add(response.data).draw();
                    } else {
                        $('#dataTable').DataTable({
                            data: response.data,
                            columns: [
                                { data: 'id', title: 'id'},
                                { data: 'prompt_date', title: 'Prompt Date' },
                                { data: 'prompt_text', title: 'Prompt Text' },
                                { data: 'url', title: 'URL' },
                                { data: 'enhancement_level', title: 'Enhancement Level' },
                                { data: 's3_url', title: 'S3 URL' },
                                { data: 'author', title: 'Author' }
                            ]
                        });
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Data from Flask</h1>
            <table id="dataTable" className="display">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Prompt Date</th>
                        <th>Prompt Text</th>
                        <th>URL</th>
                        <th>Enhancement Level</th>
                        <th>S3 URL</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
};

export default App;
