import { useContext } from "react";
import useCurrentEmployeersAdmin from "../../Hooks/useCurrentEmployeersAdmin";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import useIsEmployee from "../../Hooks/useIsEmployee";

const MyTeam = () => {
    const [hisEmail] = useCurrentEmployeersAdmin();
    const { user } = useContext(AuthContext);
    console.log(user)
    const axiosSecure = useAxiosSecure();
    console.log(hisEmail);
    const [isEmployee] = useIsEmployee();
    const { data: myTeamMembers = [], refetch } = useQuery({
        queryKey: ['myTeamMembers', user?.email],
        enabled: !!hisEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/myColleagues/${hisEmail}/${user.email}`);
            console.log(res.data);
            return res.data;
        }
    })

    const { data: AllMembers = [] } = useQuery({
        queryKey: ['AllMembers', user?.email],
        enabled: !!hisEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/allMembersUnderAdmin/${hisEmail}`);
            console.log(res.data);
            return res.data;
        }
    })

    console.log(myTeamMembers);



    const MemberBirthDay = AllMembers?.filter(member => {
        const memberBirthDay = new Date(member?.birthDate);
        const currentMonth = new Date().getMonth();
        console.log("memberBirthddate", memberBirthDay);
        const result = memberBirthDay?.getMonth() == currentMonth;
        console.log("result", result)
        return result;
    });

    const birthDayRemainingOrNot = (birthDate) => {
        const currentDate = new Date();
    
        const birthDateObj = new Date(birthDate);
        const birthMonth = birthDateObj.getMonth();
        const birthDay = birthDateObj.getDate();
    
        
        if (birthMonth === currentDate.getMonth()) {
            
            if (birthDay < currentDate.getDate()) {
                return "Birthday Already Occurred";
            } else if (birthDay === currentDate.getDate()) {
                return "Today is my Birthday. Wish Me!";
            } else {
                const daysRemaining = birthDay - currentDate.getDate();
                return `Remaining Days: ${daysRemaining}`;
            }
        } 
    };
    


    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                <title>My Team</title>
            </Helmet>

            {
                isEmployee ? (
                    <div className="text-center mt-12">
                        <h2 className="text-3xl font-semibold">Upcoming Events</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
                            {
                                MemberBirthDay?.map((member) => (
                                    <div key={member._id} className="border border-gray-300 space-y-3">
                                        <div className="h-[200px] w-full">
                                            <img className="h-full w-full" src={member?.image} alt="" />
                                        </div>

                                        <div className="space-y-2">

                                            <h2>Name: {member.name}</h2>
                                            <h2>Birth Of Date: {member.birthDate}</h2>
                                            <h2>{birthDayRemainingOrNot(new Date(member.birthDate))}</h2>
                                        </div>
                                        <br />
                                    </div>

                                ))
                            }
                        </div>


                        <div className="mt-12">
                            <h2 className="text-3xl font-semibold">Team Members</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

                                {
                                    myTeamMembers?.map((teamMember) => (
                                        <div key={teamMember._id} className="border border-gray-300 space-y-3">
                                            <div className="h-[200px] w-full">
                                                <img className="h-full w-full" src={teamMember?.image} alt="" />
                                            </div>
                                            <h2 className="text-base">Name: {teamMember.name}</h2>
                                            <br />
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                )
                    :
                    <h2 className="text-4xl text-center font-bold text-red-600 mt-8">Contact With Your HR/Admin!</h2>
            }


            <div>

            </div>
        </div>
    );
};

export default MyTeam;