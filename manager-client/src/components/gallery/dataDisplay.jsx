import React, { useEffect, useState, useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './styles/dataDisplay.css';

function DataDisplay(props) {
    const [page, setPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [paginationOptions, setPaginationOptions] = useState({});

    useEffect(() => {
        setPaginationOptions({
            page: page,
            sizePerPage: sizePerPage,
            totalSize: props.totalCount,
            alwaysShowAllBtns: true,
            withFirstAndLast: false,
            hideSizePerPage: false,
            hidePageListOnlyOnePage: true,
            sizePerPageList: [
                { text: '10', value: 10 },
                { text: '25', value: 25 },
                { text: '50', value: 50 }
            ],
            onPageChange: (newPage, sizePerPage) => {
                const endPage = Math.ceil(props.totalCount / sizePerPage);
                const currentLast = Math.ceil(props.loadedImages.length / sizePerPage);

                if (newPage <= currentLast) {
                    setPage(newPage);
                    if (newPage === currentLast && currentLast < endPage) {
                        props.addImages();
                    }
                }
            },
            onSizePerPageChange: (newSizePerPage, newPage) => {
                setPage(1);
                setSizePerPage(newSizePerPage);
            }
        });
    }, [page, sizePerPage, props.totalCount, props.loadedImages.length]);

    useEffect(() => {
        setPage(1); // Reset page to 1 when filters change
    }, [props.totalCount]);

    const data = props.loadedImages;

    const columns = useMemo(() => [
        {
            dataField: 'prompt_date',
            text: 'Date',
            sort: true,
            headerStyle: { width: '15%' },
            classes: 'expandable-cell'
        },
        {
            dataField: 'prompt_text',
            text: 'Prompt',
            sort: true,
            headerStyle: { width: '55%' },
            classes: 'expandable-cell'
        },
        {
            dataField: 'author',
            text: 'Author',
            sort: true,
            headerStyle: { width: '10%' },
            classes: 'expandable-cell'
        },
        {
            dataField: 's3_url',
            text: 'Source',
            sort: true,
            headerStyle: { width: '20%' },
            classes: 'expandable-cell'
        }
    ], []);

    const from = (page - 1) * sizePerPage + 1;
    const to = Math.min(page * sizePerPage, props.totalCount);

    return (
        <div className='dataTable'>
            <BootstrapTable
                keyField='id'
                data={data}
                columns={columns}
                pagination={paginationFactory(paginationOptions)}
                striped
                hover
                condensed
            />
            <div className="total-results">
                <span>Showing rows {from} to {to} of {props.totalCount} results</span>
            </div>
        </div>
    );
}

export default DataDisplay;
