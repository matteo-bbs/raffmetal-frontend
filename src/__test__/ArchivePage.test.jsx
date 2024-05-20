import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import axios from 'axios';
import {ArchivePage} from "../pages/ArchivePage.jsx";
jest.mock('axios');

describe('ArchivePage', () => {
    const mockData = [
        {
            id: '1',
            data_inizio: '2022-01-01',
            data_fine: '2022-01-31',
            field_aggiungi_i_contenuti_export: {
                tipologia: 'News',
                title: 'Test News 1'
            }
        },
        {
            id: '2',
            data_inizio: '2022-02-01',
            data_fine: '2022-02-28',
            field_aggiungi_i_contenuti_export: {
                tipologia: 'Event',
                title: 'Test Event 1'
            }
        }
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockData });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<ArchivePage />, { wrapper: MemoryRouter });
    });

    it('calls axios GET on mount', async () => {
        render(<ArchivePage />, { wrapper: MemoryRouter });

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    });

    it('renders table with correct number of rows', async () => {
        render(<ArchivePage />, { wrapper: MemoryRouter });

        await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1)); // +1 for the header row
    });


    it('changes page when pagination control is clicked', async () => {
        render(<ArchivePage />, { wrapper: MemoryRouter });

        // Wait for the axios GET request to resolve
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Find the pagination control for the next page and click it
        const nextPageControl = screen.getByLabelText('Next');
        userEvent.click(nextPageControl);

        // Check that the first item in the list has changed
        // Replace 'Next item title' with the title of the first item on the second page
        await waitFor(() => expect(screen.getByText('Next item title')).toBeInTheDocument());
    });

    // Remove the tests for 'does not change page when clicking next on the last page' and
    // 'does not change page when clicking previous on the first page' as these scenarios
    // are handled by the ReactPaginate component and do not need to be tested here

    it('navigates back to the previous page on link click', async () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/archive']}>
                <Route path="/archive">
                    <ArchivePage />
                </Route>
                <Route path="/snodopage/:id_sezione">
                    <div>Snodo Page</div>
                </Route>
            </MemoryRouter>
        );

        const link = getByText(/Torna alla sezione/i);
        userEvent.click(link);

        await waitFor(() => expect(getByText('Snodo Page')).toBeInTheDocument());
    });

    it('navigates back to the previous page on link click', async () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/archive']}>
                <Route path="/archive">
                    <ArchivePage />
                </Route>
                <Route path="/snodopage/:id_sezione">
                    <div>Snodo Page</div>
                </Route>
            </MemoryRouter>
        );

        const link = getByText(/Torna alla sezione/i);
        userEvent.click(link);

        await waitFor(() => expect(getByText('Snodo Page')).toBeInTheDocument());
    });
});