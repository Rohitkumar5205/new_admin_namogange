import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoleRights } from "../redux/slices/role_rights/roleRightsSlice";

const useRoleRights = (pageName) => {
    const dispatch = useDispatch();
    const { roleRightsList } = useSelector((state) => state.roleRights || {});
    const authUser = JSON.parse(localStorage.getItem("user"));
    const userRole = authUser?.role;

    // Ensure role rights are loaded
    useEffect(() => {
        if (!roleRightsList || roleRightsList.length === 0) {
            dispatch(getAllRoleRights());
        }
    }, [dispatch, roleRightsList]);

    // Calculate permissions
    const permissions = useMemo(() => {
        if (!roleRightsList || !userRole) {
            return { canRead: false, canWrite: false, canDelete: false };
        }

        const userRights = roleRightsList.find((r) => r.role === userRole);
        if (!userRights) {
            return { canRead: false, canWrite: false, canDelete: false };
        }

        const pagePerm = userRights.permissions.find((p) => p.page === pageName);
        return {
            canRead: pagePerm?.read || false,
            canWrite: pagePerm?.write || false,
            canDelete: pagePerm?.delete || false,
        };
    }, [roleRightsList, userRole, pageName]);

    // Determine if form should be disabled
    // Disabled if: Read is false OR (Write is false AND Delete is false)
    // Enabled if: Read is true AND (Write is true OR Delete is true)
    const isFormDisabled =
        !permissions.canRead || (!permissions.canWrite && !permissions.canDelete);

    return { ...permissions, isFormDisabled };
};

export default useRoleRights;
