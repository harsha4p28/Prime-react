import React, { useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Product {
    id: string;
    code: string;
    name: string;
    category: string;
    quantity: number;
}

const Dashboard: React.FC = () => {
    const [rowClick, setRowClick] = useState<boolean>(false);

    const [products] = useState<Product[]>([
        { id: '1000', code: 'f230fh0g3', name: 'Bamboo Watch', category: 'Accessories', quantity: 24 },
        { id: '1001', code: 'nvklal433', name: 'Black Watch', category: 'Accessories', quantity: 61 },
        { id: '1002', code: 'zz21cz3c1', name: 'Blue Band', category: 'Fitness', quantity: 2 }
    ]);

    const [selectedProducts, setSelectedProducts] = useState<Product[] | Product | null>(null);

    return (
        <div className="dashboard p-4">
            <h2 className="mb-3">Product Dashboard</h2>

            <div className="flex align-items-center gap-3 mb-3">
                <span>Enable Row Click Selection:</span>
                <InputSwitch checked={rowClick} onChange={(e) => setRowClick(e.value as boolean)} />
            </div>

            <DataTable
                value={products}
                selectionMode={rowClick ? undefined : 'checkbox'}
                selection={selectedProducts}
                onSelectionChange={(e: { value: Product[] | Product | null }) => setSelectedProducts(e.value)}
                dataKey="id"
                tableStyle={{ minWidth: '50rem' }}
            >
                {!rowClick && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />}
                <Column field="code" header="Code" />
                <Column field="name" header="Name" />
                <Column field="category" header="Category" />
                <Column field="quantity" header="Quantity" />
            </DataTable>
        </div>
    );
};

export default Dashboard;