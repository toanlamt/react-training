import { useNavigate } from "react-router-dom";
import type { UserProfile } from '../../shared/types/userProfile';
import { Table, Button, TableBody, TableHead, TableHeadCell, TableRow, TableCell } from "flowbite-react";

interface Props {
  profiles: UserProfile[];
}

const ClientProfileList: React.FC<Props> = ({ profiles }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <Table hoverable striped>
        <TableHead>
          <TableHeadCell>First Name</TableHeadCell>
          <TableHeadCell>Middle Name</TableHeadCell>
          <TableHeadCell>Last Name</TableHeadCell>
          <TableHeadCell>Age</TableHeadCell>
          <TableHeadCell>Action</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {profiles.map((profile) => (
            <TableRow
              key={profile.user_id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell>{profile.basicinfo.first_name}</TableCell>
              <TableCell>{profile.basicinfo.middle_name || "-"}</TableCell>
              <TableCell>{profile.basicinfo.last_name}</TableCell>
              <TableCell>{profile.basicinfo.age}</TableCell>
              <TableCell>
                <Button
                  size="xs"
                  onClick={() => navigate(`/pages/users/${profile.user_id}/details`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientProfileList;
