"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LevelInfoDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const levelData = [
    { level: 1, eloRange: '100 – 299', win: '+32 – +38', loss: '-25 – -31', winsToLevel: '5-6' },
    { level: 2, eloRange: '300 – 499', win: '+29 – +35', loss: '-22 – -28', winsToLevel: '5-6' },
    { level: 3, eloRange: '500 – 699', win: '+26 – +32', loss: '-19 – -25', winsToLevel: '6-7' },
    { level: 4, eloRange: '700 – 899', win: '+23 – +29', loss: '-16 – -22', winsToLevel: '7-8' },
    { level: 5, eloRange: '900 – 1099', win: '+20 – +26', loss: '-13 – -19', winsToLevel: '8-9' },
    { level: 6, eloRange: '1100 – 1299', win: '+17 – +23', loss: '-10 – -16', winsToLevel: '9-10' },
    { level: 7, eloRange: '1300 – 1499', win: '+14 – +20', loss: '-7 – -13', winsToLevel: '10-12' },
    { level: 8, eloRange: '1500 – 1699', win: '+13 – +19', loss: '-6 – -12', winsToLevel: '10-12' },
    { level: 9, eloRange: '1700 – 1899', win: '+12 – +18', loss: '-5 – -11', winsToLevel: '11-13' },
    { level: 10, eloRange: '1900 – 2099', win: '+11 – +17', loss: '-4 – -10', winsToLevel: '12-14' },
];


export default function LevelInfoDialog({ isOpen, setIsOpen }: LevelInfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Level Information</DialogTitle>
          <DialogDescription>
            Here's a breakdown of ELO ranges and gains/losses for each level.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>ELO Range</TableHead>
                        <TableHead>ELO on Win</TableHead>
                        <TableHead>ELO on Loss</TableHead>
                        <TableHead>Approx. Wins for Next Level</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {levelData.map((data) => (
                        <TableRow key={data.level}>
                            <TableCell className="font-bold">{data.level}</TableCell>
                            <TableCell>{data.eloRange}</TableCell>
                            <TableCell className="text-green-400">{data.win}</TableCell>
                            <TableCell className="text-red-400">{data.loss}</TableCell>
                            <TableCell>{data.winsToLevel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
