import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { OverlayPanel } from 'primereact/overlaypanel';
        

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const Dashboard: React.FC = () => {
    const [items, setItems] = useState<Artwork[]>([]);
    const [pickedMap, setPickedMap] = useState<Map<number, Artwork>>(new Map());
    const [startIdx, setStartIdx] = useState(0);
    const perPage = 12;
    const [total, setTotal] = useState(0);
    const [userInput,setUserInput]=useState('');
    const opRef = useRef<OverlayPanel>(null);
const [inputValue, setInputValue] = useState('');

    const loadData = async (page: number) => {
        const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
        const data = await res.json();
        setTotal(data.pagination.total);
        const artworks = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
        }));
        setItems(artworks);
    };

    const showOverlay = (event: React.MouseEvent) => {
        opRef.current?.toggle(event);
    };

    useEffect(() => {
        const page = startIdx / perPage + 1;
        loadData(page);
    }, [startIdx]);

    const handleSubmit = async () => {
        const numToSelect = parseInt(inputValue.trim());
        if (isNaN(numToSelect) || numToSelect <= 0) return;

        const perPage = 12;
        const pagesNeeded = Math.ceil(numToSelect / perPage);
        const selectedArtworks: Artwork[] = [];

        for (let i = 1; i <= pagesNeeded; i++) {
            const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${i}`);
            const data = await res.json();
            const artworks = data.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                inscriptions: item.inscriptions,
                date_start: item.date_start,
                date_end: item.date_end,
            }));
            selectedArtworks.push(...artworks);

            if (selectedArtworks.length >= numToSelect) break;
        }

        const updated = new Map(pickedMap);
        for (let i = 0; i < Math.min(numToSelect, selectedArtworks.length); i++) {
            updated.set(selectedArtworks[i].id, selectedArtworks[i]);
        }

        setPickedMap(updated);
        setUserInput(inputValue);
        setInputValue('');
        opRef.current?.hide();
    };


    const handleSelect = (e: { value: Artwork[] }) => {
        const selected = e.value;
        const updated = new Map(pickedMap);
        for (const item of items) {
            updated.delete(item.id);
        }
        for (const art of selected) {
            updated.set(art.id, art);
        }
        setPickedMap(updated);
    };

    const changePage = (e: { first: number }) => {
        setStartIdx(e.first);
    };

    const getSelectedOnPage = () => {
        return items.filter((art) => pickedMap.has(art.id));
    };

    return (
        <div className="dashboard p-4">
            <h2 className="mb-3">Dashboard</h2>
            <DataTable
                value={items}
                selection={getSelectedOnPage()}
                onSelectionChange={handleSelect}
                dataKey="id"
                selectionMode="checkbox"
                tableStyle={{ minWidth: '60rem' }}
            >
                
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '4rem' }}
                    header={() => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span className="p-selection-column" />
                            <i
                                className="pi pi-chevron-down"
                                style={{ cursor: 'pointer', fontSize: '1rem' }}
                                onClick={(e) => showOverlay(e)}
                                title="Open input"
                            />
                        </div>
                    )}
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
            <Paginator
                first={startIdx}
                rows={perPage}
                totalRecords={total}
                onPageChange={changePage}
                className="mt-4"
            />
            <OverlayPanel ref={opRef}>
                <div style={{ minWidth: '200px' }}>
                    <input
                        type="text"
                        className="p-inputtext p-component"
                        placeholder="Enter value"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <button
                        className="p-button p-component p-button-sm"
                        style={{ width: '100%' , color:'white', backgroundColor:'blue'}}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </OverlayPanel>

        </div>
    );
};

export default Dashboard;