import { Donation } from '../types/donation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export function DonationCard({ donation }: { donation: Donation }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{donation.items}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>{donation.status}</Badge>
        <p>Weight: {donation.weight}kg</p>
        <Progress value={(donation.weight / 100) * 100} />
      </CardContent>
    </Card>
  );
}
