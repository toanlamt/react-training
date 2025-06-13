import { TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import { Table, Button, Badge, Spinner } from "flowbite-react";
import NotFound from '../../404.tsx';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKYCStore } from '../../shared/store/kycStore';
import {getFullName} from '../../utils/getFullName.ts';

export const KYCReviewPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { fetchPendingKYC, pendingKYCList, approveKYC, rejectKYC, isLoading, error } = useKYCStore();

  const totalPages = Math.ceil((pendingKYCList?.length || 0) / itemsPerPage);
  const paginatedPendings = pendingKYCList
    ? pendingKYCList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : [];


  useEffect(() => {
    fetchPendingKYC();
  }, []);

  return (
    <div className="grid grid-cols-1 px-4 pt-6 xl:gap-4 dark:bg-gray-900">
      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a href="#"
                className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
                </svg>
                <a href="#"
                  className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">Admin</a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                  aria-current="page">Preview</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">KYC Submission</h1>
      </div>
      <div className="space-y-6">
        {isLoading && (
          <div className="flex justify-center">
            <Spinner size="lg" aria-label="Loading..." />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && pendingKYCList && pendingKYCList.length === 0 && <NotFound />}
        {!isLoading && pendingKYCList && pendingKYCList.length > 0 && (
          <div className="overflow-x-auto">
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {paginatedPendings.map((kyc) => (
                  <TableRow key={kyc.id}>
                    <TableCell
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/users/${kyc.user_id}/details`)}
                    >
                      {getFullName(kyc.profile) || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="inline-block">
                        <Badge color="warning" size="sm">{kyc.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{kyc.status_updated_at?.split("T")[0]}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="xs" className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800" color="success" onClick={() => approveKYC(String(kyc.user_id))}>
                          Approve
                        </Button>{" "}
                        <Button size="xs" className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800" onClick={() => rejectKYC(String(kyc.user_id))}>
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mt-4 gap-2">
        <Button
          size="xs"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="text-sm px-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="xs"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};